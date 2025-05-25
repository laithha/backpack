-- Add password reset token columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- Show the updated table structure
\d users; 