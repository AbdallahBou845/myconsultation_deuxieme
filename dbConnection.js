// dbConnection.js
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myconsultation',
});

// Attempt to connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }

  console.log('Connected to MySQL database');

  // Optionally, you can perform additional database operations here

  // Close the connection when done
  connection.end();
});
