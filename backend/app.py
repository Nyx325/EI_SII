from flask import Flask, jsonify, request
from flask_cors import CORS
from routes import opencv_bp, prueba_bp

app = Flask(__name__)
CORS(app)


@app.route("/prueba", methods=["GET"])
def obtener_data():
    usuario = {"id": 1, "nombre": "Rubén"}
    return jsonify(usuario), 200


@app.route("/prueba", methods=["POST"])
def crear_usuario():
    datos = request.get_json()
    return jsonify(datos), 201


app.register_blueprint(prueba_bp, url_prefix="/")
app.register_blueprint(opencv_bp, url_prefix="/")
