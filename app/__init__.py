
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite3:///site.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# with app.app_context():
#     db.create_all()

# app.config.from_object(Config)

from app import routes
