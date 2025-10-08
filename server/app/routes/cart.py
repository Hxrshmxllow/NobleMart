from flask import Blueprint, jsonify, request

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/", methods=["GET"])
def get_cart():
    return jsonify({"items": []})

@cart_bp.route("/add", methods=["POST"])
def add_to_cart():
    item = request.json
    return jsonify({"message": "Item added to cart", "item": item})