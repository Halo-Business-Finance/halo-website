-- Force rotation of all active encryption keys as security precaution
-- Old keys may have been exposed during the policy misconfiguration window

-- Step 1: Mark all current active keys for immediate rotation
UPDATE encryption_keys 
SET rotation_scheduled_at = now()
WHERE is_active = true;

-- Step 2: Create new master encryption keys to replace potentially compromised ones
INSERT INTO encryption_keys (key_identifier, key_hash, algorithm, expires_at, is_active)
VALUES 
  (
    'FINANCIAL_DATA_MASTER_KEY_' || to_char(now(), 'YYYYMMDD_HH24MISS'),
    encode(sha256(gen_random_bytes(64)::bytea), 'hex'),
    'AES-256-GCM-ROTATED',
    now() + interval '1 year',
    true
  ),
  (
    'LEAD_DATA_MASTER_KEY_' || to_char(now(), 'YYYYMMDD_HH24MISS'),
    encode(sha256(gen_random_bytes(64)::bytea), 'hex'),
    'AES-256-GCM-ROTATED',
    now() + interval '1 year',
    true
  ),
  (
    'SESSION_ENCRYPTION_KEY_' || to_char(now(), 'YYYYMMDD_HH24MISS'),
    encode(sha256(gen_random_bytes(64)::bytea), 'hex'),
    'AES-256-GCM-ROTATED',
    now() + interval '1 year',
    true
  );

-- Step 3: Deactivate old potentially compromised keys
UPDATE encryption_keys 
SET is_active = false
WHERE algorithm IN ('HALO-AES-EQUIV-2025', 'AES-256-GCM')
AND created_at < now() - interval '1 hour';

-- Step 4: Log the emergency key rotation
INSERT INTO security_events (
  event_type,
  severity,
  event_data,
  source
) VALUES (
  'emergency_encryption_key_rotation',
  'critical',
  jsonb_build_object(
    'reason', 'policy_vulnerability_remediation',
    'old_keys_deactivated', true,
    'new_keys_created', 3,
    'rotation_timestamp', now(),
    'policy_fix_applied', true,
    'compliance_action', 'PRECAUTIONARY_KEY_ROTATION'
  ),
  'security_key_management'
);