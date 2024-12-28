const { screeningsModel } = require('../models/screeningsModel');
const { reservationsModel } = require('../models/reservationsModel');
const { notificationsModel } = require('../models/notificationsModel');

exports.screeningsList = (req, res) => {
    screeningsModel.find()
        .populate('movie', 'title')
        .populate('cinemaHall', 'name')
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getScreeningByID = (req, res) => {
    screeningsModel.findById(req.params.id)
        .populate('movie', 'title')
        .populate('cinemaHall', 'name')
        .then(doc => {
            if (!doc) {
                return res.json([]);
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createScreening = (req, res) => {
    const screening = new screeningsModel(req.body);
    screening.save()
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateScreening = (req, res) => {
    const screeningId = req.params.id;
    const updatedData = req.body;  

    reservationsModel.find({ screening: screeningId })
        .then(reservations => {
            reservations.forEach(reservation => {
                screeningsModel.findById(screeningId)
                    .populate('movie') 
                    .then(screening => {
                        const filmId = screening.movie._id; 
                        const userId = reservation.user; 

                        const notificationText = "Attenzione, una tua prenotazione ha subito qualche modifica da un amministratore (orario, sala e prezzo potrebbero essere cambiati). Premi qui per andare alla pagina del film interessato.";

                        const newNotification = new notificationsModel({
                            user: userId,
                            text: notificationText,
                            resource: filmId
                        });

                        newNotification.save()
                            .catch(err => console.error('Error creating notification:', err));
                    })
                    .catch(err => {
                        console.error('Error finding screening:', err);
                    });
            });

            screeningsModel.findByIdAndUpdate(screeningId, updatedData, { new: true })
                .then(updatedScreening => {
                    res.json(updatedScreening);
                })
                .catch(err => {
                    res.status(500).send('Error updating screening');
                });
        })
        .catch(err => {
            res.status(500).send('Error finding reservations');
        });
};


exports.deleteScreening = (req, res) => {
    const screeningId = req.params.id;

    reservationsModel.find({ screening: screeningId })
        .then(reservations => {
            reservations.forEach(reservation => {
                screeningsModel.findById(screeningId)
                    .populate('movie') 
                    .then(screening => {
                        const filmId = screening.movie._id; 
                        const filmName = screening.movie.title; 
                        const userId = reservation.user; 

                        function formatDate(date) {
                            const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
                            return new Date(date).toLocaleDateString(undefined, options);
                        }

                        const notificationText = `Ci dispiace informarti che la tua proiezione per il film ${filmName} del ${formatDate(screening.screeningDate)} è stata annullata da un amministratore! Come previsto, sarai interamente rimborsato. Premi qui per andare alla pagina del film interessato.`;

                        const newNotification = new notificationsModel({
                            user: userId,
                            text: notificationText,
                            resource: filmId
                        });

                        newNotification.save()
                            .then(() => {
                                reservationsModel.findByIdAndDelete(reservation._id)
                                    .catch(err => console.error('Error deleting reservation:', err));
                            })
                            .catch(err => console.error('Error creating notification:', err));
                    })
                    .catch(err => {
                        console.error('Error finding screening:', err);
                    });
            });

            screeningsModel.findByIdAndDelete(screeningId)
                .then(() => {
                    res.json({ message: 'Screening and associated reservations deleted successfully' });
                })
                .catch(err => {
                    res.status(500).send('Error deleting screening');
                });
        })
        .catch(err => {
            res.status(500).send('Error finding reservations');
        });
};

exports.findScreeningsByMovie = async (req, res) => {
    try {
        const currentDate = new Date(); 

        const screenings = await screeningsModel.find({ 
            movie: req.params.movieId, 
            screeningDate: { $gte: currentDate } 
        })
        .populate({
            path: 'cinemaHall',
            select: 'name cinema'
        })
        .sort({ screeningDate: 1 }); 

        if (screenings.length === 0) {
            return res.status(200).send("");
        }

        const groupedByCinema = screenings.reduce((acc, screening) => {
            const cinemaName = screening.cinemaHall.cinema || 'Unknown Cinema';
            if (!acc[cinemaName]) {
                acc[cinemaName] = [];
            }
            acc[cinemaName].push({
                screeningId: screening._id,
                cinemaHallId: screening.cinemaHall._id,
                cinemaHallName: screening.cinemaHall.name,
                ticketPrice: screening.ticketPrice,
                screeningDate: screening.screeningDate
            });
            return acc;
        }, {});

        res.json(groupedByCinema);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.findScreeningsByDate = (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send('Date query parameter is required');
    }

    screeningsModel.find({
        screeningDate: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    })
    .populate('movie', 'title')
    .populate('cinemaHall', 'name')
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No screenings found on this date');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
}

exports.getBookedSeatsByScreening = async (req, res) => {
    try {
        const screeningId = req.params.screeningId;

        const reservations = await reservationsModel.find({ screening: screeningId })
            .populate({
                path: 'seats',
                select: 'row column',
            });

        if (!reservations.length) {
            return res.status(404).json({ message: 'No seats booked for this screening' });
        }

        const bookedSeats = reservations.flatMap(reservation => reservation.seats);

        res.json(bookedSeats);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.findScreeningsByCinemaHallAndDate = async (req, res) => {
    try {
        const { cinemaHallId, date } = req.params;

        if (!cinemaHallId || !date) {
            return res.status(400).send('Cinema hall ID and date are required');
        }

        const startDate = new Date(date);
        const endDate = new Date(new Date(date).setDate(startDate.getDate() + 1));

        const screenings = await screeningsModel.find({
            cinemaHall: cinemaHallId,
            screeningDate: { $gte: startDate, $lt: endDate }
        })
        .populate('movie') 
        .sort({ screeningDate: 1 }); 

        if (!screenings || screenings.length === 0) {
            return res.status(200).send("");
        }

        res.json(screenings);
    } catch (err) {
        res.status(500).send(err);
    }
};