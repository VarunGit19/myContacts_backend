const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        const conenct = mongoose.connect(process.env.CONNECTION_STRING)
        console.log("Database connected");
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDB