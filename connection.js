const { default: mongoose } = require("mongoose");
const conString = "mongodb+srv://ravisadariya:Ravi181229@cluster0.jusqnr5.mongodb.net/";

const connectDb = async () => {
    try {
        await mongoose.connect(conString)
        console.log("Datbase connected!");
    } catch (err) {
        console.log("database connection failed  ", err)
    }
}

module.exports = connectDb

