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
const io = new Server(server, {cors: {origin: '*'}});

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
        // TODO: check se l'utente è effettivamente admin 
        userId = id;
        adminSockets.set(id, socket);
        isAdmin = true;
        console.log('Un admin si è registrato');
    });

    // Riconosci gli amministratori
    socket.on('registerUser', (id) => {
        userId = id;
        userSockets.set(id, socket);
        isAdmin = false;
        console.log('Un admin si è registrato');
    });

    // Assegna notifiche agli admin
    socket.on('newReview', (reviewData) => {
        console.log('Nuova recensione ricevuta');
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

    socket.on('newFilm', async (reviewData) => {
        console.log('Nuovo film ricevuto');
        console.log(reviewData);
        reviewData = JSON.parse(reviewData);
        genres = reviewData.genres;

        const userPromises = genres.map(async (genreId) => {
            try {
                const response = await axios.get(`/genre/${genreId}`);
                console.log(response.data);
                return response.data.users;
            } catch (error) {
                console.error(`Errore durante la chiamata per il genere ${genreId}:`, error);
                return []; // Restituisci un array vuoto in caso di errore
            }
        });
    
        try {
            // Aspetta che tutte le richieste siano completate
            const usersByGenre = await Promise.all(userPromises);
    
            // Unisci tutti gli utenti in un unico array senza duplicati
            const allUsers = [...new Set(usersByGenre.flat())];
    
            // Itera su ogni userSocket
            userSockets.forEach((userSocket, userId) => {
                if (userSocket.connected) {
                    if (allUsers.includes(userId)) {
                        try {
                            userSocket.emit('newFilmNotification', reviewData);
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
