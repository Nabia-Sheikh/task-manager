const mongoose = require("mongoose")

const connectionURL = "mongodb://127.0.0.1:27017/task-manager-mongoose";

const connection = async () => {
    try {
        await mongoose.connect(connectionURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            })
        console.log("Connected to DB!");
    } catch (error) {
        console.log(error);
    }
        
}
connection()
    

