let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

var port = process.env.PORT || 2410
app.listen(port, () => console.log(`Node app Listening on port ${port}!`));

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Ashish7071122145@",
  database: "postgres",
  port: 5432,
  host: "db.lfccweznrefslsqkxxic.supabase.co",
  ssl: { rejectUnauthorized: false },
});

client.connect(function (res, error) {
  console.log("Connected!!!");
});

// app.get("/users", function(req,res,next){
//     console.log("Inside /users get api");
//     const query = `SELECT * FROM users`;
//     client.query(query, function(err, result){
//         if(err) res.status(404).send(err);
//         else res.send(result.rows);
//         client.end();
//     }) ;
// });

// app.post("/users", function(req,res,next){
//     console.log("Inside post of users");
//     var values = Object.values(req.body);
//     console.log(values);
//     const query = `INSERT INTO users (id,email, firstName, lastname, age) VALUES($1,$2,$3,$4,$5)`;
//     client.query(query,values,function(err,result){
//         if(err) res.status(404).send(err)
//         else res.send(`${result.rowCount} Insertion SuccessFull`)
//     })
// })

// function insertPersons() {
//     let { employees } = require("./employeesData.js");
//     let values = employees.map((e) => [e.empCode, e.name, e.department, e.designation, e.salary, e.gender]);
//     let query = `INSERT INTO employees (empcode, name, department, designation, salary, gender) VALUES ${values.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(", ")}`;
//     let flattenedValues = [].concat(...values); // Flatten the array of arrays
//     client.query(query, flattenedValues, function (err, result) {
//         if (err) console.log(err);
//         else console.log("Successfully Inserted ", result.rowCount);
//     });
// }

// insertPersons();

app.get("/employees", function (req, res, next) {
  let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;
  let sortBy = req.query.sortBy;
  let query = `SELECT * FROM employees where 1=1`;
  if (department) query += ` AND department = '${department}'`;
  if (designation) query += ` AND designation = '${designation}'`;
  if (gender) query += ` AND gender = '${gender}'`;
  if (sortBy) query += ` ORDER BY ${sortBy} ASC`;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});

app.get("/employees/:empcode", function (req, res, next) {
  let empcode = +req.params.empcode;
  let query = ` SELECT * FROM employees WHERE empcode = ${empcode} `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});

app.get("/employees/department/:department", function (req, res, next) {
  let department = req.params.department;
  let query = ` SELECT * FROM employees WHERE department = '${department}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});
app.get("/employees/designation/:designation", function (req, res, next) {
  let designation = req.params.designation;
  let query = ` SELECT * FROM employees WHERE designation = '${designation}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});

app.post("/employees", function (req, res, next) {
  var values = Object.values(req.body);
  console.log(values);
  let query = ` INSERT INTO employees(empcode, name, department, designation,salary, gender) VALUES ($1,$2,$3,$4,$5,$6) `;
  client.query(query, values, function (err, result) {
    if (err) res.status(404).send(err.message);
    else res.send(` ${result.rowCount} Insertion Succesfull`);
  });
});

app.put("/employees/:empcode", function (req, res, next) {
  let empcode = +req.params.empcode;
  let upEmp = req.body;

  const query = `
        UPDATE employees 
        SET name = $1, department = $2, designation = $3, salary = $4, gender = $5
        WHERE empcode = $6
    `;

  const values = [
    upEmp.name,
    upEmp.department,
    upEmp.designation,
    upEmp.salary,
    upEmp.gender,
    empcode,
  ];

  client.query(query, values, function (err, result) {
    if (err) {
      res.status(404).send(err.message);
    } else {
      res.send(`Updated employee with empcode ${empcode}`);
    }
  });
});


app.delete("/employees/:empcode", function(req, res,next)
{
    let empcode = +req.params.empcode;
    let query = ` DELETE FROM employees WHERE empcode = '${empcode}' `;
    client.query(query, function(err, result){
        if(err) res.status(404).send(err);
        else res.send(`Deleted employee with empcode ${empcode}`)
    })

})




