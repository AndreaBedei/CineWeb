const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const moviesRouter = require('./src/routes/moviesRoutes');
const usersRouter = require('./src/routes/usersRoutes');
const genresRouter = require('./src/routes/genresRoutes');
const cinemaHallsRouter = require('./src/routes/cinemaHallsRoutes');
const screeningsRouter = require('./src/routes/screeningsRoutes');
const reviewsRouter = require('./src/routes/reviewsRoutes');
const seatsRouter = require('./src/routes/seatsRoutes');
const reservationsRouter = require('./src/routes/reservationsRoutes');
const imagesRouter = require('./src/routes/imagesRoutes');
const path = require('path');

mongoose.connect('mongodb+srv://andrea:paperino@progettoweb.fz4bm.mongodb.net/?retryWrites=true&w=majority&appName=ProgettoWeb');

const app = express();

app.use(cors({
    origin: '*', // URL della tua applicazione frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metodi consentiti
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers consentiti
}));

app.use(express.json());

app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/genres', genresRouter);
app.use('/cinemaHalls', cinemaHallsRouter);
app.use('/screenings', screeningsRouter);
app.use('/reviews', reviewsRouter);
app.use('/seats', seatsRouter);
app.use('/reservations', reservationsRouter);
app.use('/image', imagesRouter);
app.use('/img', express.static(path.join(__dirname, 'img')));

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
