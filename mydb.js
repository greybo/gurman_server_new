const { getDatabase, ref, set } = require('firebase/database');
const { app } = require('./initFirebase');

// Отримуємо посилання на базу даних
const database = getDatabase(app);

// Function to save data to Firebase Realtime Database
async function saveData(path, data) {
    try {
        const dbRef = ref(database, path);
        await set(dbRef, data);
        console.log('Data saved successfully at', path);
        return path;
    } catch (error) {
        console.error('Error saving data:', error);
        throw error;
    }
}

module.exports = { saveData };