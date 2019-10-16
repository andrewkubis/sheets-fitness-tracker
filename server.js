const express = require('express');
const path = require('path');
const gapi = require('./services/gapi.js').GAPI;
const app = express();

// Serve the static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());

app.get('/sheetNames', async (req, res) => {
    const response = await gapi.getSheetNames("1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY");
    res.json(response);
});

app.get('/id/:id/data', async (req, res) => {
    return res.json(await gapi.getAllDataTransformed(req.params.id));
})

app.post('/id/:id/sheet/:sheet/entry', async (req, res) => {
    console.log("Hit.");
    console.log(req.body.entry);
    gapi.addEntry(req.params.id, req.params.sheet, [req.body.entry]);
    return res.json({sent: true});
})

// Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
