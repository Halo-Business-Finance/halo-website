-- Reset failed login attempts for varda
UPDATE admin_users SET failed_login_attempts = 0 WHERE email = 'varda@halobusinessfinance.com';