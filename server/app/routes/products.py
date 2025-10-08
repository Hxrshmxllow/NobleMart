from flask import Blueprint, jsonify, request
from app.models.product_model import get_products_by_category, get_all_products

products_bp = Blueprint("products", __name__)

@products_bp.route("/category/<category_name>", methods=["GET"])
def fetch_by_category(category_name):
    items = get_products_by_category(category_name)
    return jsonify(items), 200

@products_bp.route("/", methods=["GET"])
def get_products():
    import json
    start_key_param = request.args.get("startKey")
    try:
        start_key = json.loads(start_key_param) if start_key_param else None
    except Exception:
        return jsonify({"error": "Invalid startKey"}), 400
    result = get_all_products(start_key)
    return jsonify(result), 200