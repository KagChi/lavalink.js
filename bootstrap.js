const axios = require("axios");
const urls = require("./url.js");
const fs = require('fs')
const express = require('express');
const http = require('http');
const app = express();
let application = fs.readFileSync('./application.yml', 'utf8')

if (process.env.PORT) {
    application = application.replace('DYNAMICPORT', process.env.PORT)
}

if (process.env.PASS) {
    application = application.replace('youshallnotpass', process.env.PASS)
}
fs.writeFileSync('./application.yml', application)

const download = function (url, dest, cb) { //modified code from https://stackoverflow.com/a/22907134
    const file = fs.createWriteStream(dest);
    http.get(url, function (response) {
        response.pipe(file);
        console.log('Downloading Lavalink.jar')
        file.on('finish', function () {
            console.log('Downloaded Lavalink.jar')
            file.close(cb);
        });
    }).on('error', function (err) {
        fs.unlinkSync(dest);
        console.error(err)
    });
};

const uptimerobo = async () => {
    setInterval(() => {
        urls.forEach(url => {
            axios.get(url).then(() => console.log("Pong at " + Date.now())).catch(() => {});
        });
    }, 60 * 1000);
};

uptimerobo();

function startLavalink() {
    const spawn = require('child_process').spawn;
    const child = spawn('java', ['-jar', 'Lavalink.jar'])

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (data) => {
        console.log(data);
    });

    child.stderr.on('data', (data) => {
        console.error(data);
    });

    child.on('error', (error) => {
        console.error(error);
    });

    child.on('close', (code) => {
        console.log(`Lavalink exited with code ${code}`);
    });
}

const cdn = 'http://cdn.glitch.com/2cf2d9f7-ec3a-4513-a642-80d41b6148fe%2FLavalink.jar?v=1591244803929'
download(cdn, './Lavalink.jar', startLavalink)


app.get("/", (request, response) => {
  response.status(200).send("OK");
});
