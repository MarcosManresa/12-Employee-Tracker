const sql = require('mysql');
const inquirer = require("inquirer");
const table = require("console.table");

var connucting = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database:"workdb"
});

connucting.connect(function(err){
    if (err) throw err;
    console.log("connected as " + connucting.threadId + "\n");
    AskAway();
});

function AskAway(){
    inquirer.prompt({
        message:"What would you like to do",
        type: "list",
        choices: [
            "view all employees",
            "view all the departments",
            "add employee",
            "add department",
            "add role",
            "update employee role",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch(answers.choice) {
            case "view all employees":
                employeeView()
                break;

            case "view all Departments":
                viewDepartments();
                break;

            case "add employee":
                empAdd()
                break;

            case "add Department":
                depaAdd()
                break;

            case "add role":
                roloAdd()
                break;

            case "update employee role":
                upRole();
                break;

            default:
                connucting.end()
                break;
        }
    })
}

function employeeView(){
    connucting.query(" SELECT * FROM employee", function (err, data){
        console.table(data);
        AskAway();
    })
}

function viewDepartments() {
    connucting.query("SELECT * FROM Department", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function empAdd(){
    inquirer.prompt([{
        type:"input",
        name: "firstName",
        message: "What is the employees first name?"
    },
    {
        type: "input",
        name:"last name",
        message: "What is the employees last name?"
    },
    {
        type:"number",
        name: "managerId",
        message: "What is the employees Id"
    },
    ]).then(function(res){
        connucting.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, data) {
            if(err) throw err ;
            console.table("Succesfully inserted");
            AskAway();
        })
    }) 
}

function depaAdd(){
    inquirer.prompt([{
        type:"input",
        name: "Department",
        message: "What is the Department that you want to add"
    },]).then(function(res){
        connucting.query('INSERT INTO Department (name) VALUES (?)', [res.Department], function (err, data){
            if (err) throw err;
            console.table("Inserted");
            AskAway();
        })
    })
}

function roloAdd(){
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        },
        {
            message: "enter salary:",
            type: "number",
            name: "salary"
        },
        {
            message: "enter Department ID",
            type:"number",
            name:"Department_id"
        }
    ]).then(function(response){
        connucting.query("INSERT INTO roles (title, salary, Department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data){
            console.table(data);
        })
        AskAway();
    })
}

function upRole(){
    inquirer.prompt([
        {
            message: "which employee would you like to update? (use first name only for now)",
            type: "input",
            name: "name"
        },
        {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        },
    ])
    connucting.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data){
        console.table(data);
    })
    AskAway();
}