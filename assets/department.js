const db = require('../db/connection')

viewAllDepartments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', function (err, results) {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
          });
    })
}

function addDepartment(departmentName) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = { viewAllDepartments, addDepartment }