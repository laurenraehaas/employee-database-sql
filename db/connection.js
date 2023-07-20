const mysql = require('mysql12')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log("Connected to employee_db database")
);

module.exports = db