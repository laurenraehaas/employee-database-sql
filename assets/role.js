const db = require('../db/connection')

viewAllRoles = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM role', (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

addRole = (roleName, salary, departmentName) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM departments WHERE name = ?', [departmentName], (err, results) => {
            if(err) {
                reject(err)
            } else {
                const departmentId = results[0].id

                db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [roleName, salary, departmentId], (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                })
            }
        })
    })
}

updateEmployeeRole = (employeeId, roleId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = { viewAllRoles, addRole, updateEmployeeRole }