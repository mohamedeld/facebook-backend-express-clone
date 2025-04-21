const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

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