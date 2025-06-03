# Stage 1: Build ứng dụng
FROM node:18.18.0 AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (nếu có) để tối ưu caching
COPY package.json package-lock.json* ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng (output sẽ nằm trong thư mục dist)
RUN npm run build

# Kiểm tra sự tồn tại của thư mục dist
RUN ls -la /app/dist

# Stage 2: Chạy ứng dụng với Nginx
FROM nginx:1.25.3

# Copy file build từ stage 1 vào thư mục Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file config Nginx tùy chỉnh (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 3000
EXPOSE 3000

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
