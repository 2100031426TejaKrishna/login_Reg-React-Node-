const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });
    EmployeeModel.create({ name, email, password: hash })
      .then(employee => res.json(employee))
      .catch(err => res.status(500).json({ error: err }));
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "No records found" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (!result) {
          return res.status(401).json({ message: "The password is incorrect" });
        }
        res.json({ message: "Success", user });
      });
    })
    .catch(err => res.status(500).json({ error: err }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
