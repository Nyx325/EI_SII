from flask import Blueprint, jsonify

prueba_bp = Blueprint("usuario_bp", __name__)


@prueba_bp.route("/pruebaBp", methods=["GET"])
def mostrar_data():
    return jsonify({"message": "Pong"}), 200


@prueba_bp.route("/pruebaBp", methods=["POST"])
def crear_usuario():
    return jsonify({"message": "Creado"}), 201
