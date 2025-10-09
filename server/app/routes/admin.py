from flask import Blueprint, request, jsonify
from ..models.dynamo_model import put_product
from app.utils.upc_lookup import retrieveItemData
from decimal import Decimal, ROUND_HALF_UP

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
    if product_data:
        return jsonify(product_data), 200
    else:
        return jsonify({"error": "Product not found"}), 404