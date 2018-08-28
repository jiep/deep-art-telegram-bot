import os
from flask import Flask, request, send_file
from werkzeug.exceptions import BadRequest
from werkzeug.utils import secure_filename

from evaluate import ffwd_to_img

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
INPUT_PATH = './input'
OUTPUT_PATH = './output'
MODELS_PATH = './models'

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['POST'])
def upload_file():
    if not request.form.get("style"):
        print('No selected style')
        return BadRequest('No selected style')
    print(request.form.get("style"))
    if 'file' not in request.files:
        print("No file part")
        return BadRequest('No file part')
    file = request.files['file']
    if file.filename == '':
        print('No selected file')
        return BadRequest('No selected file')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        style = request.form.get("style")
        print("Everything is OK")
        print(file)

        input_filepath = os.path.join(INPUT_PATH, filename)
        output_filepath = os.path.join(OUTPUT_PATH, filename)
        file.save(input_filepath)

        checkpoint = '{}/{}.ckpt'.format(MODELS_PATH, style)
        print(checkpoint)
        ffwd_to_img(input_filepath, output_filepath, checkpoint, '/cpu:0')
        # TODO: remove files 
        return send_file(output_filepath, mimetype='image/jpg')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
