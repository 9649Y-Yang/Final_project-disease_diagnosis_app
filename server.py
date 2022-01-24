import json
import io
import base64
import numpy as np
import keras
from PIL import Image
import re
# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array
from keras.models import load_model
from keras.preprocessing import image
# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from flask import jsonify

app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH = 'models/CNN_Xray_v31.h5'

def get_model():
    global model
    model = load_model(MODEL_PATH)
    print(" * Model loaded!")


# Call get model function
print(" * Loading Keras model...")
get_model()


def preprocess_image(image, target_size):
    if image.mode != "L":
        image = image.convert("L")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

# GET request endpoint
@app.route('/predict', methods=['POST'])
def upload():
    message = request.get_json(force=True)

    encoded = message['input_image'] # data stream represents the image 

    image_data = re.sub('^data:image/.+;base64,', '', encoded)

    decoded = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(decoded))


    processed_image = preprocess_image(image, target_size=(224, 224))
    processed_image = processed_image.reshape(-1, 224,224,1)

    predictions = model.predict(processed_image).tolist()

    print(predictions)

    response = {
        'prediction': {
            'Normal': predictions[0][0],
            'Pneumonia': predictions[0][1]
        }
    }   
    # result = {
    #     'output_image': request_image
    # }
    return jsonify(response)
    

if __name__ == "__main__":
    app.run(debug=True)


