from app import db

# class User(db.Model):
#     __tablename__ = 'user'  # You might need to change this if 'user' is a reserved keyword
#     __table_args__ = {'schema': 'public'}  # Specify the schema explicitly
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(64), index=True, unique=True)
#     email = db.Column(db.String(120), index=True, unique=True)
#     # products = db.relationship('Product', backref='seller', lazy='dynamic')

#     def __repr__(self):
#         return '<User {}>'.format(self.username)
class MyUser(db.Model):
    __tablename__ = 'my_user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    # products = db.relationship('Product', backref='seller', lazy='dynamic')

    def __repr__(self):
        return '<MyUser {}>'.format(self.username)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    quantity = db.Column(db.Integer)  # Number of products in stock
    product_details = db.relationship('ProductDetails', backref='product', lazy='dynamic')

    def __repr__(self):
        return '<Product {}>'.format(self.id)

class ProductDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    price = db.Column(db.Float)
    short_description = db.Column(db.Text)
    full_description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))

    def __repr__(self):
        return '<ProductDetails {}>'.format(self.name)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    description = db.Column(db.Text)
    products = db.relationship('Product', backref='category', lazy='dynamic')

    def __repr__(self):
        return '<Category {}>'.format(self.name)

# class Rating(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     rating = db.Column(db.Integer)
#     review = db.Column(db.Text)
#     product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

#     def __repr__(self):
#         return '<Rating {}>'.format(self.rating)