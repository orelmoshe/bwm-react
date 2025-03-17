const Booking = require('../models/booking');
const User = require('../models/user');
const Rental = require('../models/rental');
const { normalizeErrors } = require('../helpers/mongoose');
const moment = require('moment');

exports.createBooking = (req, res) => {
    const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
    const user = res.locals.user;

    const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

    Rental.findById(rental._id)
        .populate('bookings')
        .populate('user')
        .exec((err, foundRental) => {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (foundRental.user.id === user.id) {
                return res.status(422).send({ errors: [{ title: 'Invalid User!', detai: 'Cannot create booking on your Rental' }] })

            }

            // Check here for valid booking
            if (isValidBooking(booking, foundRental)) {
                booking.user = user;
                booking.rental = foundRental;
                foundRental.bookings.push(booking);

                booking.save((err) => {
                    if (err) {
                        return res.status(422).send({ errors: normalizeErrors(err.errors) });
                    }
                    foundRental.save();
                    User.update({ _id: user.id }, { $push: { bookings: booking } }, () => {

                    })
                    return res.json({ startAt: booking.startAt, endAt: booking.endAt });
                });
            } else {
                return res.status(422).send({ errors: [{ title: 'Invalid Booking!', detai: 'Choosen dates are already taken!' }] })
            }

        })
}

let isValidBooking = (proposedBooking, rental) => {
    let isValid = true;

    if (rental.bookings && rental.bookings.length > 0) {
        isValid = rental.bookings.every(booking => {
            const proposedStart = moment(proposedBooking.startAt);
            const proposedEnd = moment(proposedBooking.endAt);
            const actualStart = moment(booking.startAt);
            const actualEnd = moment(booking.endAt);

            return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart));
        })
    }
    return isValid;
} 
