import os

class Config:
    SECRET_KEY = os.environ.get('OASIS_SECRET_KEY') or 'my-secret-key'
    # SQLALCHEMY_DATABASE_URI = os.environ.get('OASIS_DATABASE_URL') or 'postgresql://username:password@localhost/mydatabase'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///../app/sqlite/database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
    SQLALCHEMY_SCHEMA = 'public'
    UPLOAD_FOLDER = 'app/static/img/uploads/'