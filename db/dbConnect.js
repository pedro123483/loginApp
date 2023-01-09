import mongoose from 'mongoose';

async function dbConnect() {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Successfully connected to MongoDB Atlas!')).catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.log(error);
    });
};

export default dbConnect;