const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {readdirSync}  = require("fs");
const connectToDb = require("./config/db");
const app = express();

app.use(express.json());
app.use(cors())


readdirSync("./routes")?.map((r)=> app.use("/api",require(`./routes/${r}`)));

const PORT = process.env.PORT || 8080;

connectToDb();

const server = app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

process.on('unhandledRejection',(err)=>{
    console.error(`unhandledRejection Error ${err.name} | ${err.message}`);
    server.close(()=>{
        console.error('Shutting down server due to unhandleRejection Error')
        process.exit(1);
    })
})