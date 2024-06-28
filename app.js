const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const AUDI_id = process.env.audi_id; // Ensure this is set correctly in your environment 
    const url = `https://us22.api.mailchimp.com/3.0/lists/${AUDI_id}`;
    const api_key = process.env.api_key;
    
    const options = {
        method: 'POST',
        auth: `anystring:${api_key}` // 'anystring' can be anything, Mailchimp requires it in the format 'anystring:apikey'
    };
    
    const request = https.request(url, options, function(response) {
        response.on('data', function(data) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/seccuss.html'); // Fixed typo from 'seccuss.html'
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res) {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
