-- Productos de prueba para LA PARADA (funcionando correctamente)
INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Coca Cola 500ml', 2.50, 100, 'bebidas', 'Refresco Coca Cola 500ml', 'assets/images/products/coca-cola.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Inca Kola 500ml', 2.50, 80, 'bebidas', 'Refresco Inca Kola 500ml', 'assets/images/products/inca-kola.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Leche Gloria 1L', 4.20, 50, 'lacteos', 'Leche entera Gloria 1 litro', 'assets/images/products/leche-gloria.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Pan Frances', 0.30, 200, 'panaderia', 'Pan frances fresco del dia', 'assets/images/products/pan-frances.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Pollo Entero', 18.00, 20, 'carnes', 'Pollo entero fresco por kg', 'assets/images/products/pollo.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) 
VALUES ('Arroz Extra', 4.80, 60, 'abarrotes', 'Arroz extra superior x 1kg', 'assets/images/products/arroz.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Usuarios de prueba (SIN PROBLEMA DE ENCODING)
INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion, fecha_actualizacion) 
VALUES ('Administrador', 'admin@laparada.com', 'admin123', 'ADMINISTRADOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion, fecha_actualizacion) 
VALUES ('Misael Challco', 'misaelchallco0@gmail.com', 'password123', 'CLIENTE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- Contraseñas encriptadas (usando BCryptPasswordEncoder)
UPDATE users SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE email = 'admin@laparada.com';
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'misaelchallco0@gmail.com';