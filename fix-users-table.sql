-- First, let's see what columns exist in the users table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- Add the missing password_hash column
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Also add other missing columns that might be needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Now create the admin user
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