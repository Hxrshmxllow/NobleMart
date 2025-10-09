from app import create_app
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()
app = create_app()
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
