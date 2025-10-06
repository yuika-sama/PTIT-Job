# Migration từ PostgreSQL Local sang Supabase

## Bước 1: Tạo Supabase Project

1. Truy cập https://supabase.com/
2. Tạo account mới hoặc đăng nhập
3. Tạo project mới
4. Chờ project khởi tạo xong

## Bước 2: Lấy thông tin kết nối

Trong Supabase Dashboard:
1. Vào **Settings** > **Database**
2. Copy thông tin sau:
   - Host (ví dụ: aws-0-ap-southeast-1.pooler.supabase.com)
   - Database name (thường là postgres)
   - Port (thường là 5432)
   - User (postgres.your-project-ref)
   - Password (password bạn đã đặt)

3. Vào **Settings** > **API**
   - Copy Project URL
   - Copy anon public key
   - Copy service_role key

## Bước 3: Cập nhật file .env

Thay thế các giá trị trong file .env với thông tin từ Supabase:

```env
# Supabase Database Configuration
PGUSER=postgres.your-project-ref
PGHOST=aws-0-ap-southeast-1.pooler.supabase.com
PGPASSWORD=your-database-password
PGDATABASE=postgres
PGPORT=5432
PGSCHEMA=public

# Supabase Project Configuration  
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Bước 4: Export dữ liệu từ local database

```bash
# Export schema và dữ liệu từ local PostgreSQL
pg_dump -h localhost -U postgres -d postgres -n ptitjob --schema-only > schema.sql
pg_dump -h localhost -U postgres -d postgres -n ptitjob --data-only > data.sql
```

## Bước 5: Import vào Supabase

### Cách 1: Sử dụng Supabase SQL Editor
1. Vào Supabase Dashboard > SQL Editor
2. Copy nội dung file schema.sql và chạy
3. Copy nội dung file data.sql và chạy

### Cách 2: Sử dụng psql
```bash
# Import schema
psql -h aws-0-ap-southeast-1.pooler.supabase.com -U postgres.your-project-ref -d postgres -f schema.sql

# Import data
psql -h aws-0-ap-southeast-1.pooler.supabase.com -U postgres.your-project-ref -d postgres -f data.sql
```

## Bước 6: Cài đặt dependencies

```bash
cd server/nodeServer
bun install @supabase/supabase-js
```

## Bước 7: Test kết nối

```bash
cd server/nodeServer
bun run dev
```

Kiểm tra console log để đảm bảo kết nối thành công: "Connected to Supabase database"

## Bước 8: Cập nhật Row Level Security (RLS)

Trong Supabase Dashboard > Authentication > Policies:
1. Enable RLS cho các bảng cần thiết
2. Tạo policies phù hợp với logic ứng dụng

## Troubleshooting

### Lỗi SSL
Nếu gặp lỗi SSL, thêm vào connection string:
```typescript
ssl: { rejectUnauthorized: false }
```

### Lỗi schema
Nếu không tìm thấy tables, kiểm tra:
1. Schema đã được import đúng chưa
2. Search path đã đúng chưa (public thay vì ptitjob)

### Lỗi connection timeout
Kiểm tra:
1. IP có được whitelist trong Supabase không
2. Firewall có block connection không