import base64
import binascii
import cv2
import numpy as np
from flask import Blueprint, jsonify, request, current_app

from controller import process_image

opencv_bp = Blueprint("opencv_bp", __name__)

@opencv_bp.route("/opencv", methods=["POST"])
def upload_image():
    # 1) Validar JSON y campo 'image'
    data = request.get_json(silent=True, force=True)
    if not data or "image" not in data:
        return jsonify({"error": 'Falta el campo "image" en el cuerpo'}), 400

    image_data = data["image"]
    if not isinstance(image_data, str):
        return jsonify({"error": 'El campo "image" debe ser una cadena base64'}), 400

    # 2) Eliminar prefijo Data URL si está presente
    if image_data.startswith("data:image"):
        # Divide solo en la primera coma
        image_data = image_data.split(",", 1)[1]  # :contentReference[oaicite:3]{index=3}

    # 3) Corregir padding para len % 4 == 0
    missing_padding = (-len(image_data)) % 4
    if missing_padding:
        image_data += "=" * missing_padding      # :contentReference[oaicite:4]{index=4}

    # 4) Decodificar base64 con manejo de errores específicos
    try:
        image_bytes = base64.b64decode(image_data)
    except (binascii.Error, ValueError) as e:
        # Invalid padding o caracteres no válidos
        return jsonify({"error": f"Base64 inválido: {e}"}), 400  # :contentReference[oaicite:5]{index=5}

    # 5) Convertir a NumPy y decodificar imagen
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "No se pudo decodificar la imagen con OpenCV"}), 400  # 

    # 6) Procesar la imagen (guardarla, analizarla, etc.)
    try:
        # Procesar imagen
        process_image(img)
    except Exception as e:
        current_app.logger.error(f"Error guardando imagen: {e}")
        return jsonify({"error": "Error interno guardando la imagen"}), 500

    return jsonify({"message": "Imagen procesada exitosamente"}), 200
