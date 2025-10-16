from flask import Blueprint, request, jsonify
from ..models.dynamo_model import put_product
from app.utils.upc_lookup import retrieveItemData
from decimal import Decimal, ROUND_HALF_UP
from app.utils.ai_util import clean_product_with_ai
from app.utils.auth_utils import token_required
from app.models.product_model import get_product
from app.models.order_model import get_all_orders, update_order


admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/upload-product', methods=['POST'])
def upload_product():
    data = request.json
    if not data.get('upc'):
        return jsonify({'error': 'UPC is required'}), 400
    try:
        price = Decimal(str(data["price"])).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        data["price"] = price
    except (ValueError, TypeError, InvalidOperation):
        return jsonify({"error": "Invalid price format"}), 400
    result = put_product(data)
    if result:
        return jsonify({'message': 'Product uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Failed to upload'}), 500
    
@admin_bp.route("/fetch-product", methods=["POST"])
def fetch_product():
    upc = request.json.get("upc")
    if not upc:
        return jsonify({"error": "UPC code required"}), 400

    product_data = retrieveItemData(upc)
    if not product_data:
        return jsonify({"error": "Product not found"}), 404
    url = product_data['image']
    cleaned_product = clean_product_with_ai(product_data, upc=upc)
    cleaned_product['image'] = url
    return jsonify(cleaned_product), 200

@admin_bp.route("/orders", methods=["GET"])
@token_required
def get_orders(current_user):
    status = request.args.get("status")
    if not status:
        return jsonify({"error": "Status required for fetching orders."}), 400
    try:
        orders = get_all_orders(status).get("orders")
        if not orders:
            return jsonify({"message": f"No orders found with status '{status}'."}), 404
        for order in orders:
            for item in order.get("items", []):
                upc = item.get("upc")
                if not upc:
                    continue
                res = get_product(upc)
                if res:
                    item["brand"] = res.get("brand")
                    item["name"] = res.get("name")
                    item["image"] = res.get("image")
        return jsonify({"orders": orders}), 200
    except Exception as e:
        print("Error fetching orders:", e)
        return jsonify({"error": "Internal server error."}), 500
    
@admin_bp.route("/orders/update-status", methods=["POST"])
@token_required
def update_order_status(current_user):
    data = request.get_json()
    accountNumber = data.get("accountNumber")
    orderNumber = data.get("orderNumber")
    status = data.get("status")

    if not orderNumber or not status:
        return jsonify({"error": "Status and Order Number are required for updating order status."}), 400

    res = update_order(accountNumber, orderNumber, status)

    if not res:
        return jsonify({"error": "Error updating order status. Order not found or update failed."}), 404
    else:
        return jsonify({"message": "Order status successfully updated!"}), 200