const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters']
    },
    email: {
        type: String,
        unique: true,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        lowercase: true,
        required: 'Email is required',
        match: [/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/]
    },
    password: {
        type: String,
        min: [4, 'Too short, min is 4 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is required'
    },
    rentals: [
        {
            type: Schema.ObjectId,
            ref: 'Rental'
        }
    ],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }]
});

// userSchema.pre('save', next => {
//     const user = this;
//     bcrypt.genSalt(10, function (err, salt) {
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             user.password = hash;
//             next();
//         });
//     });
// });

// Compare passwords 
userSchema.methods.hasSamePassword = function (requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}


userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);


