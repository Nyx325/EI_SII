# routes/opencv_routes.py
import base64
import binascii
from io import BytesIO

import cv2
import numpy as np
from controller import process_image
from flask import Blueprint, current_app, jsonify, request
from PIL import Image

opencv_bp = Blueprint("opencv_bp", __name__)


@opencv_bp.route("/opencv", methods=["POST"])
def upload_image():
    data = request.get_json(force=True)
    if not data or "image" not in data:
        return jsonify({"error": 'Falta el campo "image"'}), 400

    b64 = data["image"]
    if b64.startswith("data:image"):
        b64 = b64.split(",", 1)[1]
    b64 += "=" * ((4 - len(b64) % 4) % 4)

    try:
        img_bytes = base64.b64decode(b64)
    except (binascii.Error, ValueError) as e:
        return jsonify({"error": f"Base64 inválido: {e}"}), 400

    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"error": "No se pudo decodificar la imagen"}), 400

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)

    bio = BytesIO()
    pil_img.save(bio, format="PNG")
    bio.seek(0)

    try:
        clase = process_image(bio)
        clase = clase.item()
        return jsonify({"figure": clase}), 200
    except Exception as e:
        current_app.logger.error(f"Error procesando imagen: {e}")
        return jsonify({"error": "Internal server error"}), 500
