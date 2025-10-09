from flask import Blueprint, request, jsonify, session
from app.models.cart_model import add_to_cart, get_cart, remove_from_cart
from datetime import datetime

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/add", methods=["POST"])
def add_item():
    data = request.json
    cart = session.get("cart", [])
    cart.append(data)
    session["cart"] = cart
    print(session["cart"])
    return jsonify({"message": "Added to session cart"}), 200

@cart_bp.route("/", methods=["GET"])
def get_user_cart():
    items = session.get("cart")
    print(items)
    return jsonify(items), 200

@cart_bp.route("/remove", methods=["DELETE"])
def remove_item():
    data = request.json
    if not data or "upc" not in data:
        return jsonify({"error": "Missing upc"}), 400
    cart = session.get("cart", [])
    upc = data["upc"]
    new_cart = [item for item in cart if item.get("upc") != upc]
    if len(new_cart) == len(cart):
        return jsonify({"error": "Item not found in cart"}), 404
    session["cart"] = new_cart
    return jsonify({"message": "Item removed"}), 200
