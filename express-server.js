const https = require('https')
const AWS = require("aws-sdk")
const express = require('express')
const app = express()
const port = 3000

let weatherApiKey = null;
const owmLocationUrl = 'https://api.openweathermap.org/geo/1.0/direct?q={city}&limit={limit}&appid={API key}';
const owmWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}';
const resultLimit = 5;

// Static files from React build directory
app.use(express.static('build'))

// TODO Input validation, especially for commas in city input
app.get('/location/:city', (req, res, next) => {
    // City
    let city = req.params.city;
    console.log(`Checking for city: ${city}`);

    // Generate URL
    const finalUrl = owmLocationUrl
        .replace("{city}", city)
        .replace("{limit}", resultLimit.toString())
        .replace("{API key}", weatherApiKey);
    console.log(finalUrl);

    // Call OpenWeatherMap
    https.get(finalUrl, (response) => {
        var {statusCode} = response;

        let error;

        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        }

        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            response.resume();
        }

        response.setEncoding('utf8');
        let rawData = '';

        response.on('data', (chunk) => {
            rawData += chunk;
        });

        response.on('end', () => {
            try {
                const parsedData = JSON.stringify(rawData);
                console.log(parsedData);
                res.send(parsedData);
            } catch (err) {
                console.log(err)
                res.status(err.status || 500);
                res.send({error: err.message});
            }
        });
    }).on('error', (err) => {
        console.log(err)
        res.status(err.status || 500);
        res.send({error: err.message});
    });
});

// TODO Input validation
app.get('/weather/lat/:lat/lon/:lon', (req, res, next) => {
    // Lat and Long
    let lat = req.params.lat;
    let lon = req.params.lon;
    console.log(`Checking for lat|lon: ${lat}|${lon}`);

    // Generate URL
    const finalUrl = owmWeatherUrl
        .replace("{lat}", lat)
        .replace("{lon}", lon)
        .replace("{API key}", weatherApiKey);
    console.log(finalUrl);

    // Call OpenWeatherMap
    https.get(finalUrl, (response) => {
        var {statusCode} = response;

        let error;

        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        }

        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            response.resume();
        }

        response.setEncoding('utf8');
        let rawData = '';

        response.on('data', (chunk) => {
            rawData += chunk;
        });

        response.on('end', () => {
            try {
                const parsedData = JSON.stringify(rawData);
                console.log(parsedData);
                res.send(parsedData);
            } catch (err) {
                console.log(err)
                res.status(err.status || 500);
                res.send({error: err.message});
            }
        });
    }).on('error', (err) => {
        console.log(err)
        res.status(err.status || 500);
        res.send({error: err.message});
    });
});

app.listen(port, () => {
    // Get API key here and save it
    // Load the AWS SDK
    let AWS = require('aws-sdk'), region = "us-east-1", secretName = "prod/OpenWeather/freeAPIKey", secret,
        decodedBinarySecret;

    // Create a Secrets Manager client
    const client = new AWS.SecretsManager({
        region: region
    });

    // A good spot for additional error checking
    const secretData = client.getSecretValue({SecretId: secretName}).promise();
    secretData.then(data => {
        const weatherSecret = JSON.parse(data.SecretString);
        weatherApiKey = weatherSecret.OpenWeatherMapAPIKey;
    });
    console.log(`Weather Me This listening at http://localhost:${port}`)
})