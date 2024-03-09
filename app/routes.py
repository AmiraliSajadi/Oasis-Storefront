from app import app, db, bcrypt
from flask_bcrypt import Bcrypt
from app.models import MyUser
from sqlalchemy import text
from app.forms import RegistrationForm, LoginForm, PostForm
from app.models import MyUser, Product, Wishlist, CartItem

from flask import render_template, redirect, url_for, flash, session, request, jsonify
from flask_login import login_user, current_user, logout_user, login_required


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = MyUser(username=form.Username.data, email=form.Email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to login', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/create_user")
def create_user():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        # Create a new user
        new_user = MyUser(username='example_user', email='user@example.com')
        db.session.add(new_user)
        db.session.commit()
        flash('New user created successfully!', 'success')
    return redirect(url_for('home'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        # Check if user exists
        user = MyUser.query.filter_by(email=form.Email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            # flash('Login successful!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash("Login Unsuccessful. Please check username and password", "danger")
    return render_template('login.html', title='Login', form=form)

@app.route("/contact")
def contact():
    return render_template('contact.html', title='Contact')

@app.route("/products")
def products():
    all_products = Product.query.all()

    products_data = [{
        'id' : product.id,
        'name': product.name,
        'price': product.price,
        'short_description': product.short_description,
        'image_url': product.image_url,
        'quantity': product.quantity
    } for product in all_products]
    
    return render_template('products.html', title='Products', products=products_data)

@app.route("/product_details/<int:id>", methods=['GET'])
def productsDetails(id):
    sql_query = text("SELECT * FROM product WHERE id = :id")
    product_detail = db.session.execute(sql_query, {'id': id}).fetchone()
    return render_template('product_details.html', title='Products Details', product_detail=product_detail)

@app.route("/userProfile")
@login_required
def userProfile():
    return render_template('userProfile.html', title='User Profile')

@app.route("/user_settings")
def userSetting():
    return render_template('user_settings.html', title='User Settings')

@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    form = PostForm()
    if form.validate_on_submit():
        # Create a new product
        new_product = Product(name=form.name.data, price=form.price.data, short_description=form.shortdesc.data, full_description=form.fulldesc.data, image_url=form.img_url.data, category_id=form.category_id.data, quantity=form.quantity.data, user_id=current_user.id)
        db.session.add(new_product)
        db.session.commit()
        flash('New product created successfully!', 'success')
        return redirect(url_for('home'))
    return render_template('sell.html', title='New Product', form=form)

@app.route('/add_to_wishlist', methods=['POST'])
def handle_add_to_wishlist():
    if current_user.is_authenticated:
        data = request.get_json()
        product_id = data.get('product_id')

        wishlist_item = Wishlist(user_id=current_user.id, product_id=product_id)
        db.session.add(wishlist_item)
        db.session.commit()

        return jsonify({'message': 'Product added to wishlist'}), 200

@app.route('/add_to_cart', methods=['POST'])
@login_required
def add_to_cart():
    if current_user.is_authenticated:
        data = request.json
        product_id = data.get('productId')
        user_id = current_user.id
        
        # Check if the item is already in the user's cart
        existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += 1
        else:
            new_item = CartItem(user_id=user_id, product_id=product_id, quantity=1)
            db.session.add(new_item)
        
        db.session.commit()
        return jsonify({'message': 'Product added to cart'})

    # Implement adding item to cart here (For both logged in and not logged in users)