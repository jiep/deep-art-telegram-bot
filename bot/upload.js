const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const mime = require('mime-types');

const FILENAME = "/Users/jiep12345/Downloads/IMG-20170301-WA0000.jpg";
const API_URL = "http://127.0.0.1:5000";

var options = {
    method: 'POST',
    uri: API_URL,
    formData: {
      style: "la_muse",
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
  .catch(e => console.log(e));
