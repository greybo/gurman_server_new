const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveData } = require('./mydb.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/test', async (req, res) => {
   const email = 'test@example.com';
   const uid = 'testuid123';

    try {
        const path = await saveData(`users/${uid}`, { email, uid });
        res.status(200).send({ message: 'Data saved successfully', path: path });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ error: 'Failed to save data' });
    }
});

// Маршрут для аутентифікації
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        // Тут ви можете перевірити пароль, але Firebase Admin SDK не підтримує перевірку пароля
        // Вам потрібно використовувати Firebase Client SDK на фронтенді для аутентифікації
        res.status(200).send({ message: 'User logged in', uid: userRecord.uid });
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
