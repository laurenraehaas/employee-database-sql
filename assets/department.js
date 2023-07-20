const db = require('../db/connection')

viewAllDepartments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', function (err, results) {
            console.log(results);
          });
    })
}

addDepartment = (departmentName) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err, results) => {
            console.log(results)
        })
    })
}

module.exports = { viewAllDepartments, addDepartment }