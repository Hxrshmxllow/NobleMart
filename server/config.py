import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "devkey")
    # Database placeholder (for later AWS RDS or DynamoDB)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///noblemart.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False