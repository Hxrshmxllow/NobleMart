from flask import Blueprint, jsonify

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_products():
    products = [
        {"id": 1, "name": "Versace Eros", "price": 89.99},
        {"id": 2, "name": "Dior Sauvage", "price": 119.99},
    ]
    return jsonify(products)
