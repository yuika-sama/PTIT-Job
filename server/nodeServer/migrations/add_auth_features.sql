    -- Thêm cột refresh_token vào bảng users nếu chưa có
    ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token TEXT;

    -- Tạo index cho refresh_token để tăng hiệu suất tìm kiếm
    CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refresh_token);

    -- Đảm bảo email là unique
    ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

-- Tạo enum cho user roles nếu chưa có (tùy thuộc vào cách bạn đã implement)
-- DO $$ 
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
--         CREATE TYPE user_role AS ENUM ('user', 'employer', 'admin');
--     END IF;
-- END $$;

-- Cập nhật cột role để sử dụng enum (nếu cần)
-- ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;