const dotenv = require("dotenv");

dotenv.config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to Y's server!" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const userData = await myDataSource.query(
      "SELECT id, name, email FROM USERS "
    );
    console.log("USER DATA:", userData);

    return res.status(200).json({
      users: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const me = req.body;
    console.log(me);

    const password = me.password;
    const email = me.email;
    // const { password, email } = me;

    //1
    if (email === undefined || password === undefined) {
      const error = new Error("KEY_ERROR");
      error.statusCode = 400;
      throw error;
    }

    //2
    const existingUser = await myDataSource.query(`
    SELECT id, email FROM users WHERE email='${email}';
    `);

    console.log("existing user:", existingUser);
    if (existingUser.length > 0) {
      const error = new Error("DUPLICATED_EMAIL_ADDRESS");
      error.statusCode = 400;
      throw error;
    }

    //3
    if (password.length < 8) {
      const error = new Error("INVALID_PASSWORD");
      error.statusCode = 400;
      throw error;
    }

    const userData = await myDataSource.query(`
    INSERT INTO users (
      name,                    
      password,
      email
      )
    VALUES (
      'yj',
      '${password}', 
      '${email}'
      )
    `);

    return res.status(201).json({
      message: "userCreated",
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (email === undefined || password === undefined) {
      const error = new Error("KEY_ERROR");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await myDataSource.query(`
       SELECT id, email, password FROM users WHERE email='${email}';
       `);
    console.log("existing user:", existingUser);

    if (existingUser.length === 0) {
      const error = new Error("DUPLICATED_EMAIL_ADDRESS");
      error.statusCode = 400;
      throw error;
    }

    //  console.log("existing user:", existingUser);
    //  console.log("email", "password");
    //  console.log(password);  = console.log(req.body.password);

    if (password !== existingUser[0].password) {
      const error = new Error("INVALID_PASSWORD");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign({ id: existingUser[0].id }, "rekey");

    return res.status(200).json({
      message: "LOGIN_SUCCESS",
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
  }
});

const server = http.createServer(app);
const start = async () => {
  try {
    server.listen(7801, () => console.log(`Server is listening on 7801`));
  } catch (err) {
    console.error(err);
  }
};

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

start();
