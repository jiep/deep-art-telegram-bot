import os
from flask import Flask, request
from werkzeug.exceptions import BadRequest
from werkzeug.utils import secure_filename

from evaluate import ffwd_to_img

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['POST'])
def upload_file():
    print(request.__dict__)
    if 'file' not in request.files:
        print("No file part")
        return BadRequest('No file part')
    file = request.files['file']
    if file.filename == '':
        print('No selected file')
        return BadRequest('No selected file')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print("Everything is OK")
        print(file)
        return("Everything is OK.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
