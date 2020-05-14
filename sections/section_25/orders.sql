DROP TABLE IF EXISTS products;
CREATE TABLE products (
	id INT NOT NULL,
	name STRING,
	price MONEY,
	PRIMARY KEY (id)
);

INSERT INTO products
VALUES (1, 'Pen', 1.20);

INSERT INTO products (id, name)
VALUES (2, 'Pencil');

INSERT INTO products (id, name)
VALUES (3, 'Rubber');

ALTER TABLE products
ADD stock INT;

UPDATE products
SET price = 0.8, stock = 12
WHERE id = 2;

UPDATE products
SET stock = 32
WHERE id = 1;

DELETE FROM products
WHERE id = 3;

DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
	id INT NOT NULL,
	first_name STRING,
  	last_name STRING,
  	address STRING,
  	primary key (id)
);

INSERT INTO customers
VALUES (1, 'John', 'Doe', '32 Cherry Blvd'), (2, 'Angela', 'Yu', '12 Sunset Dr');

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT NOT NULL,
  order_number INT,
  customer_id INT,
  product_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO orders
VALUES (1, 4362, 2, 1), (2, 3254, 1, 1);

SELECT
  orders.order_number,
  customers.first_name,
  customers.last_name,
  products.name,
  products.price
FROM
	(orders
		INNER JOIN customers ON orders.customer_id = customers.id)
		INNER JOIN products ON orders.product_id = products.id
WHERE
	orders.customer_id = 2;
