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
const cinemasRouter = require('./src/routes/cinemasRoutes');
const imagesRouter = require('./src/routes/imagesRoutes');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

mongoose.connect('mongodb+srv://andrea:paperino@progettoweb.fz4bm.mongodb.net/?retryWrites=true&w=majority&appName=ProgettoWeb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let adminSockets = [];

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
app.use('/cinemas', cinemasRouter);
app.use('/image', imagesRouter);
app.use('/img', express.static(path.join(__dirname, 'img')));

io.on('connection', (socket) => {
    console.log('Un utente si è connesso');

    // Riconosci gli amministratori
    socket.on('registerAdmin', () => {
        adminSockets.push(socket);
        console.log('Un admin si è registrato');
    });

    // Assegna notifiche agli admin
    socket.on('newReview', (reviewData) => {
        adminSockets.forEach((adminSocket) => {
            adminSocket.emit('newReviewNotification', reviewData);
        });
    });

    // Gestione della disconnessione
    socket.on('disconnect', () => {
        adminSockets = adminSockets.filter((adminSocket) => adminSocket !== socket);
        console.log('Un utente si è disconnesso');
    });
});

app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
