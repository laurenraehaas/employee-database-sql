const inquirer = require('inquirer')

const { viewAllDepartments, addDepartment } = require('./assets/department')
const { viewAllRoles, addRole, updateEmployeeRole } = require('./assets/role')
const { viewAllEmployees, addEmployee } = require('./assets/employee')

const mysql = require('mysql2')


function menu() {
  inquirer.prompt([
      {
          type: 'list',
          name: 'method',
          message: 'Which method do you want to use?',
          choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add department',
              'Add role',
              'Add employee',
              'Update employee role',
              'Go back'
          ]
      }
  ])
  .then((answer) => {
      switch (answer.method) {
          case 'View all departments':
              viewAllDepartments()
              .then((results) => {
                  console.table(results);
                  menu();
              })
              break;
            case 'View all roles':
              viewAllRoles()
                .then((results) => {
                  console.table(results);
                  menu();
                })
              break;
            case 'View all employees':
              viewAllEmployees()
                .then((results) => {
                  console.table(results);
                  menu();
                })
              break;
            case 'Add department':
              promptAddDepartment().then(() => {
                menu();
              })
                break;
            case 'Add role':
              promptAddRole().then(() => {
                menu();
              })
                break;
            case 'Add employee':
              promptAddEmployee().then(() => {
                menu();
              })
                break;
            case 'Update employee role':
              promptUpdateEmployeeRole().then(() => {
                menu();
              })
                break;
              case 'Go back':
                break;
                default:
                  process.exit(0)  
      }
  })
  .catch(err => {
    console.log('An error has occurred', err)
    process.exit(1)
  })
}


function promptAddDepartment() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter a name for the department'
      },
    ])
    .then((answer) => {
      const departmentName = answer.departmentName.trim()
      if(departmentName) {
        addDepartment(departmentName)
          .then(() => {
            console.log('department added!!')
            menu()
          })
          .catch((err) => {
            console.log('There was an error adding the department', err)
            menu()
          })
      } else {
        console.log('Please use a valid department name')
        menu()
      }
    })
    .catch((err) => {
      console.log('An error has occurred', err)
      process.exit(1)
    })
}


function promptAddRole() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'Please enter a name for a new role'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter a salary for the new role'
      },
      {
        type: 'input',
        name: 'department',
        message: 'Please enter which department this new role falls under'
      },
    ])
    .then((answers) => {
      const roleName = answers.roleName.trim()
      const salary = parseFloat(((answers.salary)).replace(/\D/g, ''))
      const department = answers.department.trim()

      const departmentExists = function (department) {
        return new Promise((resolve, reject) => {
          db.query('SELECT COUNT(*) AS count FROM departments WHERE name = ?', [department], (err, results) => {
            if(err) {
              reject(err)
            } else {
              const count = results[0].count
              resolve(count > 0)
            }
          })
        })
      }

      if(roleName && !isNaN(salary) && departmentExists) {
        addRole(roleName, salary, department)
          .then(() => {
            console.log('Role added!!')
            menu()
          })
          .catch((err) => {
            console.log('An error occurred when adding the role', err)
            menu()
          })
      } else {
        console.log('Please add valid role information')
        menu()
      }
    })
    .catch((err) => {
      console.log('An error occurred', err)
      process.exit(1)
    })
} 


function promptAddEmployee() {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Please enter the employee's first name"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Please enter the employee's last name"
      },
      {
        type: 'input',
        name: 'role',
        message: "Please enter the employee's role",
      },
      {
        type: 'input',
        name: 'manager',
        message: "Is the employee a manager? (yes/no)",
          validate: function (input) {
            return input === 'yes' || input === 'no' || 'Please enter "yes" or "no"'
          }
      },
      {
        type: 'input',
        name: 'manager2',
        message: "Please enter the employee's managers last name",
        when: function (answers) {
          return answers.isManager === 'no'
        }
      },
    ])
    .then((answers) => {
      const firstName = answers.firstName.trim()
      const lastName = answers.lastName.trim()
      const role = answers.role.trim()
      const manager = answers.manager

      const roleIsReal = (role) => {
        return new Promise((resolve, reject) => {
          db.query('SELECT COUNT(*) AS count FROM roles WHERE title = ?', [role], (err, results) => {
            if (err) {
              reject(err)
            } else {
              const count = results[0].count
              if (count > 0) {
                resolve(true)
              } else {
                console.log('This role does not exist')
                resolve(false)
              }
            }
          })
        })
      }

const managerIsReal = (managerFirst, managerLast) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM employee WHERE first_name = ? AND last_name = ?", [managerFirst, managerLast], (err, results) => {
      if(err) {
        reject(err)
      } else {
        const count = results[0].count
        if(count > 0) {
          resolve(true)
        } else {
          console.log("This manager does not exist")
          resolve(false)
        }
      }
    })
  })
}

if (manager === 'yes') {
  if (firstName && lastName && roleIsReal) {
    addEmployee(firstName, lastName, role, null, null)
      .then(() => {
        console.log('employee added!')
        menu()
      })
      .catch((err) => {
        console.log('error adding employee', err)
        menu()
      })
  } else {
    console.log('Please enter real employee info')
    menu()
  }
} else if (manager === 'no') {
  const managerFirst = answers.manager1.trim()
  const managerLast = answers.manager2.trim()

  if(firstName && lastName && roleIsReal && managerIsReal) {
    addEmployee(firstName, lastName, role, managerFirst, managerLast)
      .then(() => {
        console.log("New Employee Added!!")
        menu()
      })
      .catch((err) => {
        console.log("There was an error adding new employee", err)
        menu()
      })
  } else {
    console.log("Please enter valid employee info")
    menu()
  }
}
})
.catch((err) => {
  console.log("An error occurred", err)
  process.exit(1)
})
}

function promptUpdateEmployeeRole() {
  Promise.all([viewAllEmployees(), viewAllRoles()])
    .then(([employee, role]) => {
      const employeeChoice = employee.map((employee) => ({
        name: `${employee.firstName} ${employee.lastName}`,
        value: employee.id,
      }))
      const roleChoice = role.map((role) => ({
        name: role.title,
        value: role.id,
      }))
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Please select an employee to update',
            choices: employeeChoice
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Please select a new role for selected employee',
            choices: roleChoice,
          }
        ])
        .then((answers) => {
          const { employeeId, roleId } = answers
          updateEmployeeRole(employeeId, roleId)
            .then(() => {
              console.log('Updated employee role!')
              menu()
            })
            .catch((err) => {
              console.log('Error occurred while updating employee role', err)
              menu()
            })
        })
        .catch((err) => {
          console.log('An error occurred', err)
          process.exit(1)
        })
    })
    .catch((err) => {
      console.log('Error retrieving data for role or employee', err)
      process.exit(1)
    })
}

menu()
