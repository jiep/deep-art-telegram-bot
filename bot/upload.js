const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const mime = require('mime-types');

function getDeepArt(uri, style, filepath) {
  const options = {
    encoding: null,
    method: 'POST',
    uri,
    formData: {
      style,
      file: {
        value: fs.createReadStream(filepath),
        options: {
            filename: path.basename(filepath),
            contentType: mime.contentType(path.extname(filepath))
        }
      }
    }
  };
  return rp(options);
}

module.exports = { getDeepArt };
