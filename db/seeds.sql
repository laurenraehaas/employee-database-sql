INSERT INTO department (name)
VALUES ('Engineering'), ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 80000, 1), ('Data Analyst', 65000, 2), ('Product Manager', 95000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, NULL), ('Jane', 'Doe', 2, 2), ('Michael', 'Johnson', 3, 3);