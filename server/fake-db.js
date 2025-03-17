const Rental = require('./models/rental');
const User = require('./models/user');

class FakeDb {
    constructor() {
        this.rentals = [
            {
                title: 'Nice view on ocean',
                city: 'San Francisco',
                street: 'Main street',
                category: 'condo',
                image: 'https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg',
                bedrooms: 4,
                shared: true,
                description: 'Very nice apartment in center of the city',
                dailyRate: 43
            },
            {
                title: 'Modern apartment in center',
                city: 'New York',
                street: 'Time square',
                category: 'apartment',
                image: 'https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg',
                bedrooms: 1,
                shared: false,
                description: 'Very nice apartment in center of the city',
                dailyRate: 11
            },
        ]

        this.users = [{
            username: 'Test User',
            email: 'test@gmail.com',
            password: 'testtest'
        },
        {
            username: 'Test User',
            email: 'test1@gmail.com',
            password: 'testtest1'
        }]
    }

    async cleanDb() {
        await User.remove({});
        await Rental.remove({});
    }

    pushDataToDb() {
        const user = new User(this.users[0]);
        const user2 = new User(this.users[1]);

        this.rentals.forEach((rental) => {
            const newRental = new Rental(rental);
            newRental.user = user;
            user.rentals.push(newRental);
            newRental.save();
        });
        user.save();
        user2.save();
    }

    async seeDb() {
        await this.cleanDb();
        await this.pushDataToDb();
    }


}

module.exports = FakeDb;