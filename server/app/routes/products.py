from flask import Blueprint, jsonify, request
from app.models.product_model import get_products_by_category, get_all_products, get_product, get_all_brands, get_products_by_brand, fetch_new_arrivals

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

@products_bp.route("/<string:upc>", methods=["GET"])
def get_product_by_upc(upc):
    product = get_product(upc)
    if product:
        return jsonify(product), 200
    else:
        return jsonify({"error": "Product not found"}), 404
    
@products_bp.route("brands/<string:brand>", methods=["GET"])
def fetch_by_brand(brand):
    items = get_products_by_brand(brand)
    return jsonify(items), 200

@products_bp.route("get_brands", methods=["GET"])
def get_brands():
    brands = get_all_brands()
    return jsonify(brands), 200

@products_bp.route("get_new_arrivals", methods=["GET"])
def get_new_arrivals():
    items = fetch_new_arrivals()
    return jsonify(items), 200