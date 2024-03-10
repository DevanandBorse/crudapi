const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 const pool = new Pool({
    host: 'localhost',          
    port: 5432,                 
    user: 'postgres',     
    password: 'root23',  
    database: 'nodeangular'    
  });

  const query = 'SELECT NOW() AS "current_time"';
  
  pool.query(query, (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
    } else {
      console.log('Connected to PostgreSQL database. Current time:', res.rows[0].current_time);
    }
  
   
  });


  const createCategoryTable = `
  CREATE TABLE IF NOT EXISTS Category (
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL
  )
`;

const createProductTable = `
  CREATE TABLE IF NOT EXISTS Product (
    ProductId SERIAL PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    CategoryId INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Category(CategoryId)
  )
`;


pool
  .query(createCategoryTable)
  .then(() => pool.query(createProductTable))
  .then(() => {
    console.log('Tables created successfully.');
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });

//  this is categories api create for the CRUD opertions

app.post('/addcategory', async (req, res) => {
  const { categoryName } = req.body;
  try {
    await pool.query('INSERT INTO Category (CategoryName) VALUES ($1)', [categoryName]);
    res.status(201).send('Category created successfully');
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/all/category', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM Category');
      const categories = result.rows;
      res.json(categories); // Assuming the result is an object with a "rows" property
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
    }
});


app.put('/category/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName } = req.body;
  try {
      if (!categoryName || categoryName.trim() === '') {
          return res.status(400).send('Category name is required');
      }
      const result = await pool.query('UPDATE Category SET CategoryName = $1 WHERE CategoryId = $2', [categoryName, categoryId]);
      if (result.rowCount === 0) {
          return res.status(404).send('Category not found');
      }
      res.send('Category updated successfully');
  } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.delete('/category/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
      const result = await pool.query('DELETE FROM Category WHERE CategoryId = $1', [categoryId]);
      if (result.rowCount === 0) {
          return res.status(404).send('Category not found');
      }
      res.send('Category deleted successfully');
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).send('Internal Server Error');
  }
});


//  this is products api create for the CRUD opertions

app.post('/addproduct', async (req, res) => {
  const { productName, categoryId } = req.body;

  try {
      if (!productName || !categoryId) {
          return res.status(400).send('Product name and category ID are required');
      }

      await pool.query('INSERT INTO Product (ProductName, CategoryId) VALUES ($1, $2)', [productName, categoryId]);
      res.status(201).send('Product created successfully');
  } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Update SQL query to fetch product data along with category name
app.get('/all/products', async (req, res) => {
  try {
    const query = `
      SELECT p.ProductId, p.ProductName, p.CategoryId, c.CategoryName
      FROM Product p
      INNER JOIN Category c ON p.CategoryId = c.CategoryId
    `;
    const result = await pool.query(query);
    const products = result.rows;
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
});



 


app.put('/product/:id', async (req, res) => {
  const productId = req.params.id;
  const { productName, categoryId } = req.body;

  try {
      if (!productName || !categoryId) {
          return res.status(400).send('Product name and category ID are required');
      }

      await pool.query('UPDATE Product SET ProductName = $1, CategoryId = $2 WHERE ProductId = $3', [productName, categoryId, productId]);
      res.send('Product updated successfully');
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.delete('/product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      const result = await pool.query('DELETE FROM Product WHERE ProductId = $1', [productId]);
      if (result.rowCount === 0) {
          return res.status(404).send('Product not found');
      }
      res.send('Product deleted successfully');
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/getByPagination/:pageno/:limit', async (req, res) => {
  try {
      const pageno = parseInt(req.params.pageno);
      const limit = parseInt(req.params.limit);

      if (isNaN(pageno) || isNaN(limit) || pageno < 1 || limit < 1) {
          return res.status(400).json({ error: 'Invalid page number or limit' });
      }

      const offset = (pageno - 1) * limit;

      const query = `SELECT * FROM Product ORDER BY ProductId LIMIT $1 OFFSET $2`;
      const values = [limit, offset];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No products found for the given page and limit' });
      }

      res.json(result.rows);
  } catch (err) {
      console.error('Error fetching products by pagination:', err);
      res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
