import json
import io
import base64
import numpy as np
import keras
from PIL import Image
# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array
from keras.models import load_model
from keras.preprocessing import image
# Flask utils
from flask import Flask, redirect, url_for, request, render_template
# from werkzeug.utils import secure_filename
# from gevent.pywsgi import WSGIServer
from flask import jsonify

app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH = 'models/rugby_vs_football.h5'


# # Load your trained model
# model = load_model(MODEL_PATH)
# # model._make_predict_function()  
# model.predict()     # Necessary
# print('Model loaded. Start serving...')

def get_model():
    global model
    model = load_model(MODEL_PATH)
    print(" * Model loaded!")


# Call get model function
print(" * Loading Keras model...")
get_model()


# def preprocess_image(image, target_size):
#     buffer = io.BytesIO()
#     imgdata = base64.b64decode(image)
#     img = Image.open(io.BytesIO(imgdata))
#     new_img  = img.resize(target_size)
#     new_img  = img_to_array(new_img )
#     new_img  = np.expand_dims(new_img , axis=0)
#     return new_img 

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

# GET request endpoint
@app.route('/predict', methods=['POST'])
def upload():

    request_image = request.json['input_image'] # data stream represents the image 
    # processed_image = preprocess_image(request_image, target_size=(224, 224))

    message = request.get_json(force=True)
    encoded = message['image']
    decoded = base64.b64decode(encoded)
    request_image = Image.open(io.BytesIO(decoded))
    processed_image = preprocess_image(request_image, target_size=(224, 224))

    predictions = model.predict(processed_image).tolist()

    response = {
        'prediction': {
            'Rugby': predictions[0][0],
            'Soccer': predictions[0][1]
        }
    }
    # result = {
    #     'output_image': request_image
    # }
    return jsonify(response)
    



if __name__ == "__main__":
    app.run(debug=True)


