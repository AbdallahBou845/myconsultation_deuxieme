// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { questions } = require('./data'); // Import questions from data.js
const { additionalData } = require('./data2');

const app = express();
const port = 5000; // Choose any port you like


app.use(cors());
app.use(express.json());
// Middleware to parse JSON data 
app.use(bodyParser.json());
app.get('/patients/:userId/questions', (req, res) => {
  // For simplicity, just return all questions for any user
  res.json({ questions });
});
app.get('/additional-data/:userId/additionalData', (req, res) => {
  // Endpoint pour fournir des données supplémentaires au client
  res.json({ additionalData });
});
app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myconsultation',
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }

  console.log('Connected to MySQL database');
});


// Start the server

app.post('/message', async (req, res) => {
  const { username, email, password } = req.body;

  // Vérifiez d'abord si l'email existe déjà dans la table users
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkEmailQuery, [email], async (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking email:', checkError.message);
      return res.status(500).json({ error: 'Registration failed' });
    }

    if (checkResults.length > 0) {
      // L'email existe déjà, renvoyez une réponse indiquant que l'inscription a échoué
      return res.status(400).json({ error: 'Email already exists' });
    }

    // L'email n'existe pas, procédez à l'insertion
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(insertQuery, [username, email, password], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error inserting data:', insertError.message);
        return res.status(500).json({ error: 'Registration failed' });
      }

      console.log('Data inserted successfully:', insertResults);
      res.json({ success: true });
    });
  });
});







// Point d'API pour la connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (error, results) => {
    if (error) {
      console.error('Error querying data:', error.message);
      res.status(500).json({ error: 'Login failed' });
      return;
    }

    if (results.length === 0) {
      // Aucun utilisateur trouvé avec les identifiants fournis
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      console.log('Login successful:', results[0]);
      res.json({ success: true, user: results[0] });
    }
  });
});

app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;

  // Update your SQL query to use the 'admin' table
  const sql = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (error, results) => {
    if (error) {
      console.error('Error querying data:', error.message);
      res.status(500).json({ error: 'Loginadmin failed' });
      return;
    }

    if (results.length === 0) {
      // No user found with the provided credentials
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      console.log('Loginadmin successful:', results[0]);
      res.json({ success: true, user: results[0] });
    }
  });
});


// Endpoint to submit user answers
// Endpoint to submit user answers
app.post('/submit-answers', async (req, res) => {
  const { userId, answers, comments } = req.body;

  try {
    // Check if user already has responses
    const existingResponses = await checkExistingResponses(userId);

    if (existingResponses.length > 0) {
      return res.status(400).json({ error: 'User already submitted responses' });
    }

    // Map the answers to the format expected by the database
    const responses = Object.entries(answers).map(([questionId, option]) => ({
      user_id: userId,
      question_id: questionId,
      option_selected: option,
      comment: comments[questionId] !== undefined ? comments[questionId] : '', // Use empty string instead of null
    }));

    // SQL query to insert user responses
    const sql = 'INSERT INTO user_responses (user_id, question_id, option_selected, comment) VALUES ?';

    // Execute the query with the mapped responses
    connection.query(sql, [responses.map(response => Object.values(response))], (error, results) => {
      if (error) {
        console.error('Error inserting user responses:', error.message);
        return res.status(500).json({ error: 'Error adding user responses to the database' });
      }

      console.log('User responses added successfully:', results);
      res.json({ success: true });
    });
  } catch (error) {
    console.error('Error checking existing responses:', error.message);
    res.status(500).json({ error: 'Error checking existing responses' });
  }
});

// Function to check if user already has responses
const checkExistingResponses = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user_responses WHERE user_id = ?';

    connection.query(sql, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Endpoint to get user responses
app.get('/user-responses/:userId', async (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT user_responses.*, users.username FROM user_responses INNER JOIN users ON user_responses.user_id = users.id WHERE user_responses.user_id = ?';

  // Execute the query with the user ID as a parameter
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user responses:', err.message);
      return res.status(500).json({ error: 'Error fetching user responses' });
    }

    console.log('User responses fetched successfully');
    res.json({ userResponses: results });
  });
});

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    } else {
      res.json(results);
    }
  });
});


// Add this route after the other routes in your server.js file
app.put('/update-user-info', (req, res) => {
  const { userId, age, poids, actNature } = req.body;

  // Update user information in the database
  const updateQuery = 'UPDATE user_info SET age = ?, poids = ?, act_nature = ? WHERE user_id = ?';
  connection.query(updateQuery, [age, poids, actNature, userId], (error, results) => {
    if (error) {
      console.error('Error updating user information:', error.message);
      res.status(500).json({ error: 'Error updating user information in the database' });
      return;
    }

    console.log('User information updated successfully:', results);
    res.json({ success: true });
  });
});


app.post('/add-user-info', (req, res) => {
  const { userId, age, poids, taille, actNature, genre } = req.body;
  console.log('Received request with data:', req.body); // Log the request body

  // Check if the user has already submitted information
  const checkSubmissionQuery = 'SELECT * FROM user_info WHERE user_id = ?';
  connection.query(checkSubmissionQuery, [userId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking user submission:', checkError.message);
      res.status(500).json({ error: 'Error checking user submission' });
      return;
    }

    if (checkResults.length > 0) {
      // User has already submitted information
      console.log('User has already submitted information');
      res.status(400).json({ error: 'User has already submitted information' });
      return;
    }

    // User hasn't submitted information, proceed with the insertion
    const insertQuery = 'INSERT INTO user_info (user_id, age, genre, poids, taille, act_nature) VALUES (?, ?, ?, ?, ?, ?)';
    console.log('SQL Query:', insertQuery); // Log the SQL query

    connection.query(insertQuery, [userId, age, genre, poids, taille, actNature], (error, results) => {
      if (error) {
        console.error('Error inserting user information:', error.message);
        res.status(500).json({ error: 'Error adding user information to the database' });
        return;
      }

      console.log('User information added successfully:', results);
      res.json({ success: true });
    });
  });
});




// Route pour ajouter les informations IMC
app.post('/add-imc', (req, res) => {
  const { userId, imcValue } = req.body;

  // Vérifie si l'utilisateur existe dans la table user_info
  const checkUserQuery = 'SELECT * FROM user_info WHERE user_id = ?';

  connection.query(checkUserQuery, [userId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking user:', checkError.message);
      return res.status(500).json({ error: 'Error checking user' });
    }

    if (checkResults.length === 0) {
      // L'utilisateur n'existe pas
      console.log('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    // L'utilisateur existe, procède à l'insertion IMC
    const insertIMCQuery = 'INSERT INTO imc (user_id, imc_value) VALUES (?, ?)';

    connection.query(insertIMCQuery, [userId, imcValue], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error adding IMC:', insertError.message);
        return res.status(500).json({ error: 'Error adding IMC' });
      }

      console.log('IMC added successfully:', insertResults);
      res.json({ success: true });
    });
  });
});




// Endpoint to calculate Duke Score
// Example for Duke Score calculation
// Example error handling for calculateDukeScore
// Ajoutez cette route après les autres routes dans votre fichier server.js

// Endpoint pour récupérer les informations de user_info
app.get('/user-info/:userId', (req, res) => {
  const userId = req.params.userId;

  // SQL query pour récupérer les informations de user_info pour un utilisateur spécifique
  const sql = 'SELECT * FROM user_info WHERE user_id = ?';

  // Exécutez la requête avec l'ID d'utilisateur en tant que paramètre
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des informations de user_info:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des informations de user_info' });
    }

    console.log('Informations de user_info récupérées avec succès:', results);
    res.json({ userInfo: results[0] }); // Retourne la première ligne de résultats (un seul utilisateur attendu)
  });
});

app.get('/imc/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT imc_value FROM imc WHERE user_id = ? ORDER BY date DESC LIMIT 1';

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching IMC data:', err.message);
      return res.status(500).json({ error: 'Error fetching IMC data' });
    }

    console.log('IMC data fetched successfully');
    res.json({ imcData: results[0] });
  });
});


// Endpoint pour insérer les scores STOP-BANG
// Backend - Modifiez la route d'insertion pour vérifier si un score existe déjà
app.post('/insert-stopbang-score', async (req, res) => {
  const { userId, score, result } = req.body;

  console.log('Received request to insert STOP-BANG score:', { userId, score, result });
console.log('Received request to insert STOP-BANG score:', { userId, score, result });

  // Vérifiez les valeurs reçues depuis le client
  console.log('userId:', userId);
  console.log('score:', score);
  console.log('result:', result);
  // Vérification si un score existe déjà pour l'utilisateur
  const checkQuery = 'SELECT * FROM stopbang_scores WHERE user_id = ?';
  const existingScore = await new Promise((resolve, reject) => {
    connection.query(checkQuery, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });

  if (existingScore) {
    console.log('Un score existe déjà pour cet utilisateur. Aucune insertion effectuée.');
    res.json({ success: false, message: 'Un score existe déjà pour cet utilisateur.' });
  } else {
    // Si aucun score existant, effectuer l'insertion
    const insertQuery = 'INSERT INTO stopbang_scores (user_id, score, result) VALUES (?, ?, ?)';
    connection.query(insertQuery, [userId, score, result], (error) => {
      if (error) {
        console.error('Erreur lors de l\'insertion du score STOP-BANG:', error);
        res.status(500).send('Erreur serveur');
      } else {
        console.log('Score STOP-BANG inséré avec succès');
        res.json({ success: true });
      }
    });
  }
});



// Backend - Modifiez la route d'insertion pour le score Duke
app.post('/insert-duke-score', async (req, res) => {
  const { userId, score, result } = req.body;

  // Vérification si un score existe déjà pour l'utilisateur
  const checkQuery = 'SELECT * FROM duke_scores WHERE user_id = ?';
  const existingScore = await new Promise((resolve, reject) => {
    connection.query(checkQuery, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });

  if (existingScore) {
    console.log('Un score Duke existe déjà pour cet utilisateur. Aucune insertion effectuée.');
    res.json({ success: false, message: 'Un score Duke existe déjà pour cet utilisateur.' });
  } else {
    // Si aucun score existant, effectuer l'insertion dans la nouvelle table
    const insertQuery = 'INSERT INTO duke_scores (user_id, score, result) VALUES (?, ?, ?)';
    connection.query(insertQuery, [userId, score, result], (error) => {
      if (error) {
        console.error('Erreur lors de l\'insertion du score Duke:', error);
        res.status(500).send('Erreur serveur');
      } else {
        console.log('Score Duke inséré avec succès');
        res.json({ success: true });
      }
    });
  }
});

app.get('/duke-score/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT score FROM duke_scores WHERE user_id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching Duke score:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Duke score not found for the user' });
    } else {
      const dukeScore = results[0].score;
      res.json({ dukeScore });
    }
  });
});
app.post('/insert-meet-score', async (req, res) => {
  const { userId, meetScore } = req.body;

  try {
    // Tentative d'insertion du score MEET dans la base de données
    const insertQuery = 'INSERT INTO meet_scores (user_id, score) VALUES (?, ?)';
    await connection.query(insertQuery, [userId, meetScore]);

    console.log('Score MEET inséré avec succès');
    res.json({ success: true, message: 'Score MEET inséré avec succès' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Si une contrainte unique est violée (utilisateur existant), renvoyer un message approprié
      console.log('Score MEET déjà inséré pour cet utilisateur');
      return res.json({ success: false, message: 'Score MEET déjà inséré pour cet utilisateur' });
    } else {
      // Gérer d'autres erreurs
      console.error('Erreur lors de l\'insertion du score MEET:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
});




app.post('/insert-nyha-score', (req, res) => {
  const { userId, score, result } = req.body;

  // Vérifiez d'abord si le score NYHA existe déjà pour cet utilisateur
  const checkQuery = 'SELECT id FROM nyha_scores WHERE user_id = ? LIMIT 1';
  connection.query(checkQuery, [userId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Erreur lors de la vérification du score NYHA:', checkError);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    } else if (checkResults.length > 0) {
      // Un score NYHA existe déjà pour cet utilisateur
      res.json({ success: false, message: 'Le score NYHA existe déjà pour cet utilisateur' });
    } else {
      // Aucun score NYHA trouvé, procédez à l'insertion
      const insertQuery = 'INSERT INTO nyha_scores (user_id, score, result) VALUES (?, ?, ?)';
      connection.query(insertQuery, [userId, score, result], (insertError, insertResults) => {
        if (insertError) {
          console.error('Erreur lors de l\'insertion du score NYHA:', insertError);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
          res.json({ success: true, message: 'Score NYHA inséré avec succès' });
        }
      });
    }
  });
});


// Endpoint pour récupérer tous les scores et réponses des utilisateurs
// Endpoint pour récupérer tous les scores et réponses des utilisateurs
// Endpoint pour récupérer tous les scores et réponses des utilisateurs
app.get('/all-user-scores/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `
      SELECT 
        users.username,
        user_info.age,
        user_info.poids,
        duke_scores.score as duke_score,
        meet_scores.score as meet_score,
        nyha_scores.score as nyha_score,
        apfel_scores.score as apfel_score,
        stopbang_scores.score as stopbang_score
      FROM users
      LEFT JOIN user_info ON users.id = user_info.user_id
      LEFT JOIN duke_scores ON users.id = duke_scores.user_id
      LEFT JOIN meet_scores ON users.id = meet_scores.user_id
      LEFT JOIN nyha_scores ON users.id = nyha_scores.user_id
      LEFT JOIN apfel_scores ON users.id = apfel_scores.user_id
      LEFT JOIN stopbang_scores ON users.id = stopbang_scores.user_id
      WHERE users.id = ?;`;

    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user scores:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log(`User scores for user ${userId} fetched successfully`);
      res.json({ userScores: results });
    });
  } catch (error) {
    console.error('Exception while fetching user scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/insert-Apfel-score', (req, res) => {
  const { userId, score, result } = req.body;

  // Vérifiez d'abord si le score Apfel existe déjà pour cet utilisateur
  const checkQuery = 'SELECT id FROM apfel_scores WHERE user_id = ? LIMIT 1';
  connection.query(checkQuery, [userId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Erreur lors de la vérification du score Apfel:', checkError);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // Un score Apfel existe déjà pour cet utilisateur
      console.log('Le score Apfel existe déjà pour cet utilisateur');
      return res.json({ success: false, message: 'Le score Apfel existe déjà pour cet utilisateur' });
    }

    // Aucun score Apfel trouvé, procédez à l'insertion
    const insertQuery = 'INSERT INTO apfel_scores (user_id, score, result) VALUES (?, ?, ?)';
    connection.query(insertQuery, [userId, score, result], (insertError, insertResults) => {
      if (insertError) {
        console.error('Erreur lors de l\'insertion du score Apfel:', insertError);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      console.log('Score Apfel inséré avec succès');
      return res.json({ success: true, message: 'Score Apfel inséré avec succès' });
    });
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
