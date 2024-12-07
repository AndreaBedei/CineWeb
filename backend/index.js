const express = require('express');
const mongoose = require('mongoose');
const movieRouter = require('./src/routes/movieRoutes');

mongoose.connect('mongodb+srv://andrea:paperino@progettoweb.fz4bm.mongodb.net/?retryWrites=true&w=majority&appName=ProgettoWeb');

const app = express();
app.use(express.json());

app.use('/movies', movieRouter);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
