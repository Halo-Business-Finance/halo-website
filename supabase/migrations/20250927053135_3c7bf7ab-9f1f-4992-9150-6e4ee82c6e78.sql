-- Insert a default admin user with proper password hash for testing (password: admin123)
UPDATE public.admin_users 
SET password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
WHERE email = 'admin@halobusinessfinance.com';