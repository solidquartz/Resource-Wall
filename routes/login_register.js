const { offset } = require('@popperjs/core');
const express = require('express');
const { user } = require('pg/lib/defaults');
const router = express.Router();
const helperFunctions = require('./helper_functions');

module.exports = (db) => {

  const getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email])
      .then(user => {
        return user;
      })
      .catch((err) => err.message);
  };

  const addUser = (name, email, password) => {
    return db.query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [name, email, password])
      .catch((err) => err.message);
  };

  // login/register page get
  router.get("/", (req, res) => {
    const id = req.session.userID;
    res.render("login_register");
  });

  // login post
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send({ error: "Invalid input" });
      return;
    }

    getUserByEmail(email)
      .then(user => {
        let userData = user.rows[0];
        if (userData.password === password) {
          req.session.userId = userData.id;
          return res.redirect("/profiles/:id");
        }
        res.send({ error: "Invalid email or password" });
        return;
      });
  });

  // register post
  router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      res.send({ error: "Invalid input" });
      return;
    }

    getUserByEmail(email)
      .then(user => {
        if(user.rows.length !== 0){
          res.send({ error: "Email already in use" });
          return;
        }

        addUser(name, email, password)
          .then(user => {
            let userData = user.rows[0];
            req.session.userId = userData.id;
            return res.redirect("/profiles/:id");
          });

      })

  });

  return router;
};
