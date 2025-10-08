from flask import Blueprint, request, jsonify
from app.models.cart_model import add_to_cart, get_cart, remove_from_cart
from datetime import datetime

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/add", methods=["POST"])
def add_item():
    data = request.json
    required = ["userId", "upc", "quantity", "name", "price"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400

    data["addedAt"] = datetime.utcnow().isoformat()
    result = add_to_cart(data)
    if result:
        return jsonify({"message": "Item added to cart"}), 200
    return jsonify({"error": "Failed to add item"}), 500

@cart_bp.route("/<user_id>", methods=["GET"])
def get_user_cart(user_id):
    items = get_cart(user_id)
    return jsonify(items), 200

@cart_bp.route("/remove", methods=["DELETE"])
def remove_item():
    data = request.json
    if not data.get("userId") or not data.get("upc"):
        return jsonify({"error": "Missing userId or upc"}), 400

    result = remove_from_cart(data["userId"], data["upc"])
    if result:
        return jsonify({"message": "Item removed"}), 200
    return jsonify({"error": "Failed to remove item"}), 500
