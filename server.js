const express = require('express');
const path = require('path');
const gapi = require('./services/gapi.js').GAPI;

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

app.get('/getSheetNames', async (req, res) => {
    const response = await gapi.getSheetNames("1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY");
    res.json(response);
});

app.get('/gapi', async (req, res) => {
    const response = await gapi.gsRun();
    res.json(response.data);
})

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
