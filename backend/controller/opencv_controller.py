import os

import cv2
import numpy as np
from tensorflow.keras.models import load_model

# 1) Cargar el modelo COMPLETO (arquitectura + pesos) solo UNA vez
BASE_DIR    = os.path.dirname(__file__)
MODEL_PATH  = os.path.abspath(os.path.join(BASE_DIR, '..', 'data', 'cnn.h5'))
cnn = load_model(MODEL_PATH)  # contiene ya los pesos cargados :contentReference[oaicite:0]{index=0}

def process_image(img: np.ndarray) -> int:
    """
    img: numpy.ndarray en formato BGR uint8, tal como sale de cv2.imdecode
    devuelve: índice de clase (0–4)
    """
    # 2) Redimensionar a lo que espera tu red
    img_resized = cv2.resize(img, (50, 50))            # shape (50,50,3) :contentReference[oaicite:1]{index=1}

    # 3) (Opcional) Convertir BGR→RGB si entrenaste con ese orden
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

    # 4) Normalizar a [0,1]
    x = img_rgb.astype('float32') / 255.0

    # 5) Añadir dimensión batch → shape (1, 50,50,3)
    x = np.expand_dims(x, axis=0)

    # 6) Predecir
    preds   = cnn.predict(x)                           # acepta arrays NumPy en (1,h,w,c) :contentReference[oaicite:2]{index=2}
    class_i = int(np.argmax(preds, axis=1)[0])

    if class_i == 0:
      print("corazon")
    elif class_i == 1:
      print("cuadrado")
    elif class_i == 2:
      print("pentagono")
    elif class_i == 3:
      print("rombo")
    elif class_i == 4:
      print("triangulo")
    return class_i

