const express  = require('express');
const mongoose = require('mongoose');
const { MongoDB_URI } = require('./config')
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');


let campaign = require('./routes/campaign') 
let user = require('./routes/user') 
let oauth = require('./routes/oauth') 



const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded( { extended:true } ));
app.use(express.json());
app.use(cookieParser());


async function connectDatabase() {
    dbConnected = await mongoose.connect(process.env.MongoDB_URI);
    app.use('/api', oauth);
    app.use('/api', campaign);
    app.use('/api', user);


}

connectDatabase()

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () => {
    console.log(`listening on : http://localhost:${PORT}`);
});

app.get('/api', (req, res) => {

    res.send("Welcome to the Magic Mint API");

});

app.get('/', (req, res) => {

    res.send("Welcome to the Magic Mint API");

});