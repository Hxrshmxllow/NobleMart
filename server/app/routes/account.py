from flask import Blueprint, jsonify, request
from app.utils.auth_utils import token_required
from app.models.user_model import get_user_by_email, update_user


account_bp = Blueprint("account", __name__)

@account_bp.route("/users/me", methods=["GET"])
@token_required
def get_user(current_user):
    user = get_user_by_email(current_user["email"])
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)


@account_bp.route("/users/update", methods=["PUT"])
@token_required
def update_user_info(current_user):
    data = request.get_json()
    result = update_user(
        current_user["accountNumber"],
        data.get("name"),
        data.get("address")
    )
    return jsonify(result), (200 if result["status"] == "success" else 500)
