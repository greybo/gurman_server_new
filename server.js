const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Initializing the Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mytest-d3b9f.firebaseio.com"
});

const app = express();
const PORT = process.env.PORT || 3035;

app.use(cors());
app.use(bodyParser.json());

// Middleware for token validation
const authenticateToken = async (req, res, next) => {
  console.log('Check token');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

// Secure route for data storage
app.post('/users', authenticateToken, async (req, res) => {
  const { id, dataObject } = req.body;

  try {
    console.log('Try users end point');
    await admin.database().ref(`users/${id}`).set(dataObject);
    res.status(200).send({ message: 'Data saved successfully 2', path: `users/${id}` });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send({ error: 'Failed to save data' });
  }
});

// Authentication route (for demonstration only, do not use in production)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
// Nota bene: In a real application, never check passwords on the server
// This is just for demonstration purposes
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.status(200).send({ message: 'User logged in', token });
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});