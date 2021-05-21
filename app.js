const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const cTable = require('console.table');
const { async } = require('rxjs');



const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ltt1007',
    database: 'employeeManage_sysDB',
});

connection.connect((err) => {
    if (err) throw err;
    startPrompt()
    console.log("connected as id " + connection.threadId);
});

console.log(
    chalk.bgBlackBright(
        figlet.textSync('EM-System', { horizontalLayout: 'full' })
    )
);

async function startPrompt() {
    return inquirer
        .prompt([{
            type: "list",
            message: "Employee Management System",
            name: "action",
            choices: [
                "View all departments Info",
                "View all employees Info",
                "View all roles Info",
                "View all managers",
                "Add department",
                "Add employee",
                "Add role",
                "View employee by Manager",
                "Update employee role",
                "Update employee by Manager",
                "Delete departments",
                "Delete role",
                "Delete employees",
                "View the total utilized budget of a department",
                "Exit"
            ]
        }]).then((choice) => {
            switch (choice.action) {
                case "View all departments Info":
                    startPrompt()
                    ViewDepartment()
                    break;

                case "View all employees Info":
                    startPrompt()
                    ViewEmployee()
                    break;

                case "View all roles Info":
                    startPrompt()
                    ViewRole()
                    break;

                case "View all managers":
                    startPrompt()
                    ViewManager()
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add employee':
                    addEmployee()
                    break;

                case "Exit":
                    connection.end();
            }
        })
}

// main();
// async function main() {
//     let exitLoop = false;
//     while (!exitLoop) {
//         const prompt = await startPrompt();


//     }
// }
// View
// Department
async function ViewDepartment() {
    console.log(
        chalk.yellow(
            figlet.textSync('Department', { font: 'small', horizontalLayout: 'full' })
        )
    );
    const spinner = ora('Fetching Department Info').start();
    await new Promise(resolve => setTimeout(resolve, 1000));
    spinner.stop();
    let query = "SELECT * FROM department";
    connection.query(query, function(err, result) {
        if (err) throw err;
        console.table(result);
    });
}
// Role
async function ViewRole() {
    console.log(
        chalk.yellow(
            figlet.textSync('Roles', { font: 'small', horizontalLayout: 'full' })
        )
    );
    const spinner = ora('Fetching Roles Info').start();
    await new Promise(resolve => setTimeout(resolve, 1000));
    spinner.stop();
    let query = "SELECT * FROM role";
    connection.query(query, function(err, result) {
        if (err) throw err;
        console.table(result);
    });
}
// Employee
async function ViewEmployee() {
    console.log(
        chalk.yellow(
            figlet.textSync('Employees', { font: 'small', horizontalLayout: 'full' })
        )
    );
    const spinner = ora('Fetching Employees Info').start();
    await new Promise(resolve => setTimeout(resolve, 1000));
    spinner.stop();
    let query = "SELECT * FROM employee";
    connection.query(query, function(err, result) {
        if (err) throw err;
        console.table(result);
    });
}
async function ViewManager() {
    console.log(
        chalk.yellow(
            figlet.textSync('Manager', { font: 'small', horizontalLayout: 'full' })
        )
    );
    const spinner = ora('Fetching Manager Info').start();
    await new Promise(resolve => setTimeout(resolve, 1000));
    spinner.stop();
    let query = "SELECT * FROM employee WHERE manager_id IS NULL";
    connection.query(query, function(err, result) {
        if (err) throw err;
        console.table(result);
    });
}
// Add
// Department
function addDepartment() {

    inquirer.prompt([

        {
            name: 'department',
            type: 'input',
            message: 'Enter Department name',
        },
    ]).then((data) => {
        console.log(`${data.department} added`)
        let querry = `INSERT INTO department (name) VALUES ('${data.department}')`;
        connection.query(querry, err => { if (err) throw err });
        startPrompt();
    })
}
// Employee
async function addEmployee() {
    connection.query('select * from role', (err, res) => {
        if (err) throw err

        // console.table(res);
        let arr = res.map(role => ({
            name: role.title,
            value: role.id
        }));

        connection.query('select * from employee where manager_id is null', (err, data) => {
            if (err) throw err
            let arr1 = data.map(role => ({
                name: `${role.first_name} ${role.last_name}`,
                value: role.id
            }));
            inquirer.
            prompt([{
                    name: 'first_name',
                    type: 'input',
                    message: 'Please enter employee first name',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Please enter employee last name',
                },
                {
                    name: 'role_id',
                    type: 'rawlist',
                    choices: arr,
                    message: 'Please enter employee role'
                },
                {
                    name: 'manager_id',
                    type: 'rawlist',
                    message: 'Please enter employee manger id',
                    choices: arr1
                }
            ])

            .then((choices) => {
                //'INSERT INTO employee SET ?'
                console.log(`${choices.first_name} ${choices.last_name} added`);
                connection.query('INSERT employee SET ?', choices,
                    (err) => {
                        if (err) throw err;
                        startPrompt()
                    })
            })
        })
    })
}

// Role
function addRole() {
    //connection.query get depatemny id 
    inquirer.
    prompt([{
            name: 'Title',
            type: 'input',
            message: 'Enter title of new role',
        },
        {
            name: 'Salary',
            type: 'input',
            message: 'Enter Salary of new role',
        },
        {
            name: 'Department',
            type: 'input',
            message: 'Enter Department of new role',
        },
    ]).then((data) => {
        console.log(data);
        console.log(data.Title);
        console.log(data.Salary);
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.Title}', '${data.Salary}', '1')`)
    })
}