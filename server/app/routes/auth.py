from flask import Blueprint, request, jsonify
from app.utils.auth_utils import signup_user, signin_user, confirm_signup

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    result = signup_user(data["email"], data["password"], data["name"])
    return jsonify(result)

@auth_bp.route("/confirm", methods=["POST"])
def confirm():
    data = request.get_json()
    result = confirm_signup(data["email"], data["code"])
    return jsonify(result)

@auth_bp.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    result = signin_user(data["email"], data["password"])
    return jsonify(result)
