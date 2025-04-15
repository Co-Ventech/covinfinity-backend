const express = require("express");
const { chat } = require("./src/controller/chat.controller");

const app= express();

app.post('/chat',chat)


app.listen(4000,(err)=>{
    if(err) console.log(err)
})