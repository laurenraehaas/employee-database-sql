const express = require('express')

const mysql = require('mysql2')

const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log("Connected to employee_db database")
);

// Query database
let deletedRow = 2;
// delete methods
db.query(`DELETE FROM department WHERE id = ?`, deletedRow, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

db.query(`DELETE FROM role WHERE id = ?`, deletedRow, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });

  db.query(`DELETE FROM employee WHERE id = ?`, deletedRow, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
  });

// Query database
// select methods
db.query('SELECT * FROM department', function (err, results) {
  console.log(results);
});

db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
});

db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
