const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

// Ініціалізація Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mytest-d3b9f.firebaseio.com"
});

const app = express();
const PORT = process.env.PORT || 3035;

app.use(cors());
app.use(bodyParser.json());

// Middleware для перевірки токена
const authenticateToken = async (req, res, next) => {
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

// Захищений маршрут для збереження даних
app.post('/users', authenticateToken, async (req, res) => {
  const { id, dataObject } = req.body;

  try {
    await admin.database().ref(`users/${id}`).set(dataObject);
    res.status(200).send({ message: 'Data saved successfully 2', path: `users/${id}` });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send({ error: 'Failed to save data' });
  }
});

// Маршрут для аутентифікації (тільки для демонстрації, не використовуйте на production)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // Nota bene: В реальному додатку ніколи не перевіряйте паролі на сервері
    // Це лише для демонстрації
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.status(200).send({ message: 'User logged in', token });
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});