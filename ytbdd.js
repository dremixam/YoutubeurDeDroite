var config = require('./config.json');
var fs = require('fs');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function tweet() {
    fs.readFile('animaux.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }

        var lines = data.split('\n');

        var animal = lines[Math.floor(Math.random() * lines.length)].split('|');

        var animalNom = animal[0];
        var animalSexe = animal[1];

        fs.readFile('adjectifs.txt', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }

            var lines = data.split('\n');

            var adjectif = lines[Math.floor(Math.random() * lines.length)].split('|');

            var sexe = 0;
            var pronom = 'Le ';
            if (animalSexe === 'f') {
                sexe = 1;
            }

            if (animalSexe === 'm') {
                if (['a', 'e', 'i', 'o', 'u', 'é', 'è', 'â'].indexOf(animalNom.charAt(0)) !== -1 && animalNom !== 'ouistiti' && animalNom !== 'ara') {
                    pronom = "L'";
                } else if (animalNom.charAt(0) === 'h' && (animalNom.charAt(1) === 'i' || animalNom.charAt(1) === 'u' ) && animalNom !== 'hibou') {
                    pronom = "L'";
                }
            } else {
                if (['a', 'e', 'i', 'o', 'u', 'è', 'â'].indexOf(animalNom.charAt(0)) !== -1) {
                    pronom = "L'";
                } else if (animalNom.charAt(0) === 'h' && (animalNom.charAt(1) === 'i' || animalNom.charAt(1) === 'u' )) {
                    pronom = "L'";
                } else {
                    pronom = 'La ';
                }
            }

            var status = {
                status: pronom + capitalizeFirstLetter(animalNom) + ' ' + capitalizeFirstLetter(adjectif[sexe])
            };

            console.log(status);

            client.post('statuses/update', status, function (error, tweet, response) {
                if (error) {
                    console.log(error);
                    console.log(status);
                }
            });

        });
    });
}

tweet();
setInterval(tweet, config.interval);
