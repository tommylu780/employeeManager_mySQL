const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const ora = require('ora');
const cTable = require('console.table');



const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Ltt1007',
    database: 'employeeManage_sysDB',
});

connection.connect((err) => {
    if (err) throw err;
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
                "View all roles data",
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
        }])
}

main();
async function main() {
    let exitLoop = false;
    while (!exitLoop) {
        const prompt = await startPrompt();

        switch (prompt.action) {
            case "View all departments Info":
                {
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
                    break;
                }
            case "View all employees Info":
                {
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
                    break;
                }
            case "View all roles Info":
                {
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
                    break;
                }
            case "Exit":
                connection.end();
        }
    }
}