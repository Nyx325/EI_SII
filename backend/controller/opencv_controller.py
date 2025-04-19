import os

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import img_to_array, load_img

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "cnn.h5"))
cnn = load_model(MODEL_PATH)


def process_image(img) -> int:
    imagen_clasificar = load_img(img, target_size=(50, 50))
    imagen_clasificar = img_to_array(imagen_clasificar)
    imagen_clasificar = np.expand_dims(imagen_clasificar, axis=0)

    clase = cnn.predict(imagen_clasificar)
    print(clase)
    arg_max = np.argmax(clase)

    return arg_max
