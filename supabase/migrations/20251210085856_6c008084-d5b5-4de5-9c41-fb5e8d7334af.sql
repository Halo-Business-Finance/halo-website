-- Add varda@halobusinessfinance.com as admin user
-- Using the same hashing approach as existing admin

DO $$
DECLARE
  salt_value text;
  password_hash text;
  iterations integer := 32768;
BEGIN
  -- Generate strong salt
  salt_value := encode(gen_random_bytes(32), 'hex');
  
  -- Create password hash matching the hash_admin_password function
  password_hash := encode(
    digest(
      'admin123' || '::' || salt_value || '::' || 'varda@halobusinessfinance.com' || '::ADMIN_SECURE_2025',
      'sha512'
    ),
    'hex'
  );
  
  -- Apply iterations
  FOR i IN 1..iterations LOOP
    password_hash := encode(
      digest(password_hash || '::' || salt_value || '::' || i::text, 'sha512'),
      'hex'
    );
  END LOOP;
  
  -- Insert the admin user
  INSERT INTO public.admin_users (
    email,
    full_name,
    role,
    password_hash,
    password_salt,
    password_algorithm,
    password_iterations,
    is_active,
    security_clearance_level
  ) VALUES (
    'varda@halobusinessfinance.com',
    'Varda Administrator',
    'super_admin',
    password_hash,
    salt_value,
    'SCRYPT_2025',
    iterations,
    true,
    'top_secret'
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    password_salt = EXCLUDED.password_salt,
    is_active = true,
    updated_at = now();
END $$;