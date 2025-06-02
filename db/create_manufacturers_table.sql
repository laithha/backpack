-- Create manufactures table based on the provided data structure
CREATE TABLE IF NOT EXISTS manufactures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL
);

-- Insert the sample data
INSERT INTO manufactures (id, name, country) VALUES
(1, 'Nike', 'USA'),
(2, 'Adidas', 'Germany'),
(3, 'Puma', 'Germany'),
(4, 'Reebok', 'USA')
ON CONFLICT (name) DO NOTHING;

-- Reset the sequence to continue from the highest ID
SELECT setval('manufactures_id_seq', (SELECT MAX(id) FROM manufactures));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_manufactures_name ON manufactures(name);
CREATE INDEX IF NOT EXISTS idx_manufactures_country ON manufactures(country);

-- Display the table structure
\d manufactures;

-- Show all manufactures
SELECT id, name, country FROM manufactures ORDER BY id; 