const mongoose = require("mongoose");

const connectToDb = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("Db connected successfully")
        }).catch((error)=> console.log(error));
    }catch(error){
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectToDb;