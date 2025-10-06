# Hướng dẫn sử dụng Supabase

## ✅ Đã hoàn thành cấu hình

### 📁 Files đã được cập nhật:

1. **`.env`** - Cấu hình Supabase connection
2. **`config/config.ts`** - Pool connection với SSL
3. **`config/supabase.ts`** - Supabase JavaScript client
4. **`utils/supabaseUtils.ts`** - Utility functions
5. **`index.ts`** - Test endpoints
6. **`migrate.ps1`** - PowerShell migration script
7. **`migrate.sh`** - Bash migration script

### 🔧 Cấu hình Supabase hiện tại:

```env
PGHOST=db.xykqryfaptctbtcbfwwe.supabase.co
PGUSER=postgres
PGDATABASE=postgres
PGPORT=5432
PGSCHEMA=ptitjob,public
SUPABASE_URL=https://xykqryfaptctbtcbfwwe.supabase.co
```

## 🚀 Cách sử dụng

### 1. Khởi động server
```bash
bun run dev
```

### 2. Test các endpoints

#### Kiểm tra kết nối database:
```
GET http://localhost:5000/test-db
```

#### Kiểm tra Supabase client:
```
GET http://localhost:5000/test-supabase
```

#### Kiểm tra setup và schema:
```
GET http://localhost:5000/setup-check
```

#### Chuẩn bị migration:
```
GET http://localhost:5000/prepare-migration
```

#### Xem tables trong schema ptitjob:
```
GET http://localhost:5000/ptitjob-tables
```

### 3. Migration từ local database

#### Sử dụng PowerShell (Windows):
```powershell
# Chỉnh sửa LOCAL_PGPASSWORD trong migrate.ps1 trước
.\migrate.ps1
```

#### Sử dụng Bash (Linux/Mac):
```bash
# Set environment variables
export LOCAL_PGHOST=localhost
export LOCAL_PGUSER=postgres
export LOCAL_PGDATABASE=postgres

./migrate.sh
```

## 📊 Schema Management

### Tạo schema ptitjob tự động:
Server sẽ tự động tạo schema `ptitjob` nếu chưa tồn tại khi gọi `/prepare-migration`

### Kiểm tra tables:
Endpoint `/ptitjob-tables` sẽ trả về danh sách tất cả tables trong schema `ptitjob`

## 🔐 Supabase Features

### 1. PostgreSQL Pool Connection
- SSL enabled
- Connection pooling
- Schema path: ptitjob,public

### 2. Supabase JavaScript Client
- Service role client (full access)
- Anonymous client (public access)
- Real-time subscriptions ready

### 3. Row Level Security (RLS)
Có thể enable RLS trong Supabase Dashboard để bảo mật dữ liệu

## 🛠️ Troubleshooting

### Lỗi SSL Connection:
- Đảm bảo SSL được enable trong config
- Kiểm tra firewall/network

### Lỗi Schema not found:
1. Gọi `/prepare-migration` để tạo schema
2. Hoặc tạo manual trong Supabase SQL Editor:
   ```sql
   CREATE SCHEMA IF NOT EXISTS ptitjob;
   ```

### Lỗi Authentication:
- Kiểm tra PGUSER và PGPASSWORD trong .env
- Kiểm tra connection string trong Supabase Dashboard

### Migration failed:
1. Kiểm tra PostgreSQL client tools đã cài đặt
2. Kiểm tra local database connection
3. Kiểm tra Supabase connection

## 📈 Performance Tips

1. **Connection Pooling**: Đã được cấu hình trong config.ts
2. **Indexing**: Tạo indexes cho các truy vấn thường xuyên
3. **Caching**: Có thể sử dụng Redis hoặc memory cache
4. **Real-time**: Sử dụng Supabase real-time cho live updates

## 🔄 Next Steps

1. **Test migration**: Chạy migration script
2. **Verify data**: Kiểm tra dữ liệu đã migrate đúng
3. **Update API**: Đảm bảo tất cả API endpoints hoạt động
4. **Enable RLS**: Cấu hình security policies nếu cần
5. **Performance tuning**: Optimize queries và indexes