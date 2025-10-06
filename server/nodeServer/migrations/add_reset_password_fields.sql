-- Add reset password fields to users table
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry TIMESTAMP;

-- Create index for reset_token for faster lookups
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- Comment for documentation
COMMENT ON COLUMN users.reset_token IS 'Token used for password reset functionality';
COMMENT ON COLUMN users.reset_token_expiry IS 'Expiry time for reset token';