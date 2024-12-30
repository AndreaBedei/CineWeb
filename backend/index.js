const axios = require('axios');
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
const notificationsRouter = require('./src/routes/notificationsRoutes');
const imagesRouter = require('./src/routes/imagesRoutes');
const path = require('path');
const http = require('http');
const { Server, Socket } = require('socket.io');

mongoose.connect('mongodb+srv://andrea:paperino@progettoweb.fz4bm.mongodb.net/?retryWrites=true&w=majority&appName=ProgettoWeb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

/**
 * @type {Map<String, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>}
 */
let adminSockets = new Map();
/**
 * @type {Map<String, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>}
 */
let userSockets = new Map();

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
app.use('/notifications', notificationsRouter);
app.use('/image', imagesRouter);
app.use('/img', express.static(path.join(__dirname, 'img')));

io.on('connection', (socket) => {
    let userId = "";
    /**
     * @type {Boolean | undefined}
     */
    let isAdmin;

    // Riconosci gli amministratori
    socket.on('registerAdmin', (id) => {
        if (adminSockets.has(id)) {
            const oldSocket = adminSockets.get(id);
            if (oldSocket.connected) {
                oldSocket.disconnect();
            }
            adminSockets.delete(id);
        }
        userId = id;
        adminSockets.set(id, socket);
        isAdmin = true;
    });

    socket.on('registerUser', (id) => {
        if (userSockets.has(id)) {
            const oldSocket = userSockets.get(id);
            if (oldSocket.connected) {
                oldSocket.disconnect();
            }
            userSockets.delete(id);
        }
        userId = id;
        userSockets.set(id, socket);
        isAdmin = false;
    });

    socket.on('newReview', (reviewData) => {
        adminSockets.forEach((adminSocket, adminId) => {
            if (adminSocket.connected) {
                try {
                    adminSocket.emit('newReviewNotification', reviewData);
                } catch (error) {
                    console.error(`Errore nell'invio della notifica a admin ID: ${adminId}`, error);
                }
            } else {
                console.warn(`Socket non connesso per admin ID: ${adminId}`);
            }
        });
    });

    socket.on('newFilm', async (film) => {
        genres = film.genres;
        const userPromises = genres.map(async (genreId) => {
            try {
                const response = await axios.get(`http://localhost:3001/users/genre/${genreId._id}`);
                const userIds = response.data.map(user => user._id);
                return userIds;
            } catch (error) {
                console.error(`Errore durante la chiamata per il genere ${genreId._id}:`, error);
                return []; // Restituisci un array vuoto in caso di errore
            }
        });

        try {
            const usersByGenre = await Promise.all(userPromises);
            const allUsers = [...new Set(usersByGenre.flat())];
            userSockets.forEach((userSocket, userId) => {
                if (userSocket.connected) {
                    if (allUsers.includes(userId)) {
                        try {
                            userSocket.emit('newFilmNotification', film);
                        } catch (error) {
                            console.error(`Errore nell'invio della notifica a user ID: ${userId}`, error);
                        }
                    }
                } else {
                    console.warn(`Socket non connesso per user ID: ${userId}`);
                }
            });
        } catch (error) {
            console.error('Errore durante l elaborazione delle notifiche:', error);
        }
    });

    socket.on('changeScreening', async (screening) => {
        try {
            const response = await axios.get(`http://localhost:3001/reservations/screening/${screening.screening}`);
            const userIds = response.data.map(data => data.user);
            userSockets.forEach((userSocket, userId) => {
                if (userSocket.connected) {
                    if (userIds.includes(userId)) {
                        try {
                            userSocket.emit('newScreeningNotification', screening.screening);
                        } catch (error) {
                            console.error(`Errore nell'invio della notifica a user ID: ${userId}`, error);
                        }
                    }
                } else {
                    console.warn(`Socket non connesso per user ID: ${userId}`);
                }
            });
        } catch (error) {
            console.error(`Errore durante la chiamata:`, error);
            return []; // Restituisci un array vuoto in caso di errore
        }

    });

    // Gestione della disconnessione
    socket.on('disconnect', () => {
        if (isAdmin && adminSockets.delete(socket)) {
            console.log('Un utente admin si è disconnesso');
        } else if (userSockets.delete(userId)) {
            console.log('Un utente si è disconnesso');
        }
    });
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
