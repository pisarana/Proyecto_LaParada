INSERT INTO products (nombre, precio, stock, categoria, descripcion, imagen_url, activo, destacado, fecha_creacion, fecha_actualizacion) VALUES
('Aceite Primor', 7.50, 30, 'abarrotes', 'Aceite vegetal Primor 1L', 'frontend/assets/images/products/aceite-primor.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Agua Cielo 650ml', 1.20, 90, 'bebidas', 'Botella de agua Cielo 650ml', 'frontend/assets/images/products/agua_cielo_650ml.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Biopan Tostadas Crocantes 22u', 3.30, 70, 'abarrotes', 'Tostadas crocantes 22 unidades', 'frontend/assets/images/products/biopan-tostadas-crocantes-22un.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bolivar Jabón 190gr', 4.20, 100, 'limpieza', 'Jabón Bolivar 190 gramos', 'frontend/assets/images/products/bolivar-jabon-190gr.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BolsiTarro Laive Leche Evaporada', 5.10, 40, 'lacteos', 'Bolsa tarro de leche evaporada Laive', 'frontend/assets/images/products/bolsitarro_laive_leche_evaporada.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chuleta de Cerdo', 13.40, 35, 'carnes', 'Chuleta fresca de cerdo', 'frontend/assets/images/products/chuletaDeCerdo.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Coca Cola 500ml', 2.50, 100, 'bebidas', 'Refresco Coca Cola 500ml', 'frontend/assets/images/products/cocacola.jpg', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Colgate Pasta Dental', 5.60, 50, 'higiene', 'Pasta dental Colgate', 'frontend/assets/images/products/colgate_pastadental.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cordero', 40.00, 12, 'carnes', 'Cordero fresco', 'frontend/assets/images/products/cordero.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Croissant Mantequilla', 2.00, 45, 'panaderia', 'Croissant mantequilla', 'frontend/assets/images/products/croissant_mantequilla.png', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dove Spray 150ml', 8.80, 20, 'higiene', 'Desodorante Dove 150ml', 'frontend/assets/images/products/dove-desodorante-spray-150ml.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Filete de Salmón', 35.00, 14, 'pescado', 'Filete de salmón fresco', 'frontend/assets/images/products/filete-salmon.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Galleta Soreo', 4.20, 36, 'galletas', 'Galleta sabor chocolate', 'frontend/assets/images/products/galletasoreo.png', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gatorade 500ml Cool Blue', 3.00, 66, 'bebidas', 'Gatorade sabor cool blue', 'frontend/assets/images/products/gatorade_500ml_cool_blue.jpg', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion, fecha_actualizacion) 
VALUES ('Administrador', 'admin@laparada.com', 'admin123', 'ADMINISTRADOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- Actualizar con password encriptada de BCrypt
UPDATE users 
SET password = '$2a$10$dTg53m2xL6F0cgaTAEDGo.S15FMf5Y6hN7jo/fh.T/U8NJxgP/WVy'
WHERE email = 'admin@laparada.com';

INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion, fecha_actualizacion) 
VALUES ('Misael Challco', 'misaelchallco0@gmail.com', 'password123', 'CLIENTE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users (nombre, email, password, rol, activo, fecha_creacion, fecha_actualizacion) 
VALUES ('Pepito Pe', 'cliente@laparada.com', 'cliente123', 'CLIENTE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

UPDATE users
SET password = '$2a$10$h6t5JvvsJqNlwz2DZIxZpeLhzD7BY1TiSplaXbaHcUMK/dws4E1WC'
WHERE email = 'cliente@laparada.com';