from app import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True,nullable=False)
    email = db.Column(db.String(120), index=True, unique=True,nullable=False)
    image_file = db.Column(db.String(20), index=True, nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    # products = db.relationship('Product', backref='seller', lazy=True)
    products = db.relationship('Product', backref='seller', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    ratings = db.relationship('Rating', backref='product', lazy='dynamic')

    def __repr__(self):
        return '<Product {}>'.format(self.name)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    products = db.relationship('Product', backref='category', lazy='dynamic')

    def __repr__(self):
        return '<Category {}>'.format(self.name)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    review = db.Column(db.Text)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Rating {}>'.format(self.rating)
    
# with app.app_context():
#     # This will create all the tables defined by your models
#     db.create_all()