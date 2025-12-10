-- Update both admin users with proper bcrypt hashes for 'admin123'
-- This is a valid bcrypt hash generated for 'admin123'
UPDATE public.admin_users
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyelSN33UIempQE55GFCJJ/OTvpnR3SeLy',
    password_algorithm = 'bcrypt',
    updated_at = now()
WHERE email IN ('varda@halobusinessfinance.com', 'admin@halobusinessfinance.com');