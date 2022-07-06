// // PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

// Query Functions
const getAllCategories = (db) => {
  return db.query(`SELECT * FROM categories ORDER BY name;`)
    .then(data => {
      return data.rows;
    });
};

const getAllResources = (db) => {
  return db.query(`SELECT * FROM resources;`)
    .then(data => {
      return data.rows;
    });
};

const getRatings = (db, resourceID) => {
  return db.query(`SELECT * FROM ratings WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getLikes = (db, resourceID) => {
  return db.query(`SELECT * FROM likes WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getComments = (db, resourceID) => {
  return db.query(`SELECT * FROM comments WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getResourceInfo = (db, resourceID) => {
  return db.query(`
  SELECT *
  FROM resources
  JOIN categories ON category_id = categories.id
  JOIN users ON user_id = users.id
  WHERE resources.id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getAllResourceInfo = (db, resourceID) => {
  const queries = [getResourceInfo(db, resourceID), getRatings(db, resourceID), getLikes(db, resourceID), getComments(db, resourceID)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourceInfo: ", err.message));
}

const getAllResourcesAndCategories = (db) => {
  const queries = [getAllResources(db), getAllCategories(db)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourcesAndCategories: ", err.message));
};

const updateUserInfo = (db, name, email, password, id) => {
  return db.query(`UPDATE users
  SET name = $1, email = $2, password = $3
  WHERE id = $4
  RETURNING *;`, [name, email, password, id])
    .catch((err) => err.message);
};

const getUserByEmail = (db, email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
      return user;
    })
    .catch((err) => err.message);
};

const addUser = (db, name, email, password) => {
  return db.query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [name, email, password])
    .catch((err) => err.message);
};



module.exports = {
  getAllCategories,
  getAllResources,
  getAllResourcesAndCategories,
  getAllResourceInfo,
  updateUserInfo,
  getUserByEmail,
  addUser
};
