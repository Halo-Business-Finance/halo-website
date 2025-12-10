-- Update varda@halobusinessfinance.com password with bcrypt hash
-- bcrypt hash of 'admin123' 
UPDATE public.admin_users
SET password_hash = '$2a$10$rZLdBZu8xHjMNB4n.MBHseCH8Kz3tNrq3k5q0qPYI1s1kBzM7J1Fy',
    password_algorithm = 'bcrypt',
    password_iterations = 10,
    updated_at = now()
WHERE email = 'varda@halobusinessfinance.com';