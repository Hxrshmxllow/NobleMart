from flask import Blueprint, request, jsonify
from app.utils.auth_utils import token_required
from app.models.user_model import get_user_by_email
from app.models.order_model import put_order, get_orders_by_user, get_order_details
from app.models.product_model import get_product

orders_bp = Blueprint("orders", __name__)

@orders_bp.route("/place_order", methods=["POST"])
@token_required
def create_order(current_user):
    try:
        data = request.get_json()
        items = data.get("items", [])
        total = str(data.get("total", 0))
        address = data.get("address", "")
        status = data.get("status", "Pending")

        if not items or not total or not address:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400
        
        filtered_items = []
        for item in items:
            upc = item.get("upc")
            quantity = item.get("quantity") or item.get("qty") or 1
            price = item.get("price")
            if upc:
                filtered_items.append({
                    "upc": str(upc),
                    "quantity": int(quantity),
                    "price": str(price)
                })

        if not filtered_items:
            return jsonify({"status": "error", "message": "Invalid or empty items list"}), 400

        user = get_user_by_email(current_user["email"])
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        result = put_order(user["accountNumber"], filtered_items, total, address, status)
        return jsonify(result), (200 if result["status"] == "success" else 500)
    except Exception as e:
        print("[ERROR] create_order:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@orders_bp.route("/myorders", methods=["GET"])
@token_required
def get_my_orders(current_user):
    try:
        user = get_user_by_email(current_user["email"])
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        result = get_orders_by_user(user["accountNumber"])
        return jsonify(result), (200 if result["status"] == "success" else 500)
    except Exception as e:
        print("[ERROR] get_my_orders:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


@orders_bp.route("/<order_number>", methods=["GET"])
@token_required
def get_order(current_user, order_number):
    try:
        user = get_user_by_email(current_user["email"])
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        result = get_order_details(user["accountNumber"], order_number)
        for item in result['order']['items']:
            upc = item.get('upc')
            res = get_product(upc)
            item['brand'] = res.get('brand')
            item['name'] = res.get('name')
            item['image'] = res.get('image')
        return jsonify(result), (200 if result["status"] == "success" else 404)
    except Exception as e:
        print("[ERROR] get_order:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
