-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin user
-- Password hash for "Admin123!" generated with bcrypt
INSERT INTO users (email, name, password_hash, role) 
VALUES (
  'b10smith5@gmail.com',
  'Ben Smith',
  '$2a$10$rQJ9Z0Y5vL.f3qKN6.QJmOHpXxXGd5z1FH.RLlONfDl5.FqK4K4.C',
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the user was created
SELECT id, email, name, role, created_at FROM users WHERE email = 'b10smith5@gmail.com';