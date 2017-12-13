const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const mime = require('mime-types');

const FILENAME = "IMG-20170302-WA0000.jpg";
const API_URL = "http://127.0.0.1:5000";


var options = {
    method: 'POST',
    uri: API_URL,
    formData: {
        file: {
            value: fs.createReadStream(FILENAME),
            options: {
                filename: path.basename(FILENAME),
                contentType: mime.contentType(path.extname(FILENAME))
            }
        }
    }
};

rp(options)
  .then(r=>console.log("OK"))
  .catch(e => console.log("ERROR"));
