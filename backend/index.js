const express = require('express');
const app = express();

app.get('/',(req, res)=>{
    res.send('Hello World')
})

app.all('*',(req, res)=>{
    res.send('<h1>Risorsa non trovata</h1>')
})

app.listen(3000)