from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from app import models
# Create database tables if they don't exist
with app.app_context():
    try:
        db.drop_all()
        db.create_all()
        print("Database tables created successfully.")
    except Exception as e:
        print("An error occurred while creating database tables:", str(e))

from app import routes