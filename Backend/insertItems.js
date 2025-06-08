const express = require("express");
const jwt = require('jsonwebtoken');
const uuid4 = require("uuid4");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Inventory",
  password: "Biru@123",
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("MySQL connected successfully!");
  }
});

//authonticate middleware
const secreate_key = 'welcome';
function authonticate(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token){
    return res.status(401).json({success:false, message:'Access denied. No token provided.'});
  }
 jwt.verify(token,secreate_key,(err,user)=>{
  if(err){
  if(err === 'TokenExpiredError'){
    return res.status(401).json({success:false,message:'token expired please login again'})
  }
    return res.status(401).json({success:false,message:'invalid token'})
  }
  req.user=user;
  next();
 });
}

const baseUrl = "/Login-and-SignUp-Page";

app.post(`${baseUrl}/showList`, (req, res) => {
  const info = req.body;
  const id = uuid4();
  let name = info.name;
  let price = info.price;
  let quantity = info.quantity;
  let description = info.description;
  let sql =
    "insert into itemsList(id,name,price,quantity,description)values(?,?,?,?,?)";
  const values = [id, name, price, quantity, description];
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const insertedItem = { id, name, price, quantity, description };
      return res.json({
        success: true,
        message: "successfully add items",
        insertedItem: insertedItem,
      });
    }
  });
});

app.get(`${baseUrl}/showList`,authonticate, (req, res) => {
  connection.query("SELECT * FROM itemsList", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    res.json({ success: true, items: results });
  });
});

// update
app.put(`${baseUrl}/update/:id`, (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { name, price, quantity, description } = req.body;
  const sql = `UPDATE itemsList SET name=?, price=?, quantity=?, description=? WHERE id=?`;
  const values = [name, price, quantity, description, id];
  connection.query(sql, values, (err, results) => {
    if (err) {
      return res.json({ success: false, message: "failed" });
    } else {
      console.log("success");
      const insertedItem = { id, name, price, quantity, description };
      return res.json({
        success: true,
        message: "successfully update",
        insertedItem: insertedItem,
      });
    }
  });
});

// delete
app.delete(`${baseUrl}/delete/:id`, (req, res) => {
  const id = req.params.id;
  const sql = `delete from itemsList where id=?`;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.json({ success: false, message: "failed" });
    } else {
      return res.json({ success: true, message: "delete success", id });
    }
  });
});

app.listen(port, () => {
  console.log(`server will start ${port}`);
});


process.on('SIGINT', () => {
  connection.end(err => {
    if (err) console.error('Error closing db connection:', err);
    else console.log('DB connection closed.');
    process.exit();
  });
});