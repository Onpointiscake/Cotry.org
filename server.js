const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes/index');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'test') {
    // Conexión a MongoDB solo si no estamos en el entorno de test
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Connected to MongoDB!"))
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
            process.exit(1);
        });
}

app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log(`Server running on http://localhost:3000`);
    });
}

module.exports = app; // Exporta la app para usarla en las pruebas