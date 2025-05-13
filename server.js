const express = require("express");
const { chat } = require("./src/controller/chat.controller");
const bodyParser = require("body-parser");
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');
    //ws.send("Connected to the server")

    ws.on('message', (message) => {
        const messageStr = message.toString(); // Convert buffer to string
        console.log(`Received: ${messageStr}`);
        chat(messageStr).then(value=>{
            ws.send(value)
        })
        .catch(e=>{
            ws.send(e)
        })
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };
});

app.get('/',(req,res)=>{
    res.send({
        message:"helloo"
    })
})


server.listen(4000, (err) => {
    console.log("server listening on port 4000")
    if (err) console.log(err)
})