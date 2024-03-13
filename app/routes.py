import os

from app import app, db, bcrypt
from flask_bcrypt import Bcrypt
from app.models import MyUser
from sqlalchemy import text
from app.forms import RegistrationForm, LoginForm, PostForm
from app.models import MyUser, Product, Wishlist, CartItem, Category

from flask import render_template, redirect, url_for, flash, session, request, jsonify
from flask_login import login_user, current_user, logout_user, login_required
from werkzeug.utils import secure_filename


@app.route("/")
@app.route("/home")
def home():
    categories = Category.query.all()

    product_ids_group_1 = [15, 14, 3, 4] 
    product_ids_group_2 = [15, 13,14, 16] 

    # Fetch products that match the provided IDs
    products_group_1 = Product.query.filter(Product.id.in_(product_ids_group_1)).all()
    products_group_2 = Product.query.filter(Product.id.in_(product_ids_group_2)).all()

    print("Group 1:", products_group_1)  
    print("Group 2:", products_group_2)  

    return render_template('home.html',categories=categories, products_group_1=products_group_1, products_group_2=products_group_2)

@app.context_processor
def inject_categories():
    categories = Category.query.all()
    return dict(categories=categories)


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
@app.route("/products/<category_name>")
def products(category_name=None):

    page = request.args.get('page', 1, type=int)

    if category_name:
        category = Category.query.filter_by(name=category_name).first()
        if category:
            all_products = Product.query.filter_by(category_id=category.id).paginate(page=page, per_page=10)
        else:
            all_products = None
            flash('No such category found.', 'warning')
    else:
        all_products = Product.query.paginate(page=page, per_page=10)

    
    return render_template('products.html', title='Products' if not category_name else category_name, products=all_products)

@app.route("/product_details/<int:id>", methods=['GET'])
def productsDetails(id):
    sql_query = text("SELECT * FROM product WHERE id = :id")
    product_detail = db.session.execute(sql_query, {'id': id}).fetchone()
    return render_template('product_details.html', title='Products Details', product_detail=product_detail)

@app.route("/userProfile")
def userProfile():
    return render_template('user_settings.html', title='User Profile')

@app.route("/user_settings")
@login_required
def user_settings():
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

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    # Implement adding item to cart here (For both logged in and not logged in users)
    if current_user.is_authenticated:
        data = request.json
        product_id = data.get('productId')
        user_id = current_user.id
        existing_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += 1
        else:
            new_item = CartItem(user_id=user_id, product_id=product_id, quantity=1)
            db.session.add(new_item)
        
        db.session.commit()
        return jsonify({'message': 'Product added to cart'})
    else:
        flash('Please log in first.', 'error')
        return jsonify({'error': 'User not logged in'}), 401

@app.route('/get_cart_items', methods=['GET'])
@login_required
def get_cart_items():
    user_id = current_user.id
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    items = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            items.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'short_description': product.short_description,
                'quantity': item.quantity  # Include quantity from the cart
            })
    return jsonify(items)

@app.route('/remove_cart_item/<int:item_id>', methods=['DELETE'])
@login_required
def remove_cart_item(item_id):
    user_id = current_user.id
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=item_id).first()
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Cart item removed successfully'})
    else:
        return jsonify({'message': 'Cart item not found'}), 404

@app.route('/update_cart_quantity', methods=['POST'])
@login_required
def update_cart_quantity():
    data = request.json
    product_id = data.get('productId')
    change = data.get('change')
    user_id = current_user.id
    
    # Update the quantity of the cart item
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += change
        if cart_item.quantity <= 0:
            db.session.delete(cart_item)
        db.session.commit()
    
    return jsonify({'message': 'Cart quantity updated successfully'})

@app.route('/update_product_quantities', methods=['POST'])
@login_required
def update_product_quantities():
    user_id = current_user.id
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    # Update product quantities based on cart items
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            product.quantity -= item.quantity
    
    db.session.commit()
    
    return jsonify({'message': 'Product quantities updated successfully'})

@app.route('/clear_cart', methods=['DELETE'])
@login_required
def clear_cart():
    user_id = current_user.id
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    # Delete all cart items
    for item in cart_items:
        db.session.delete(item)
    
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared successfully'})


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_item():
    if request.method == 'POST':
        product_name = request.form.get('productName')
        short_description = request.form.get('shortDescription')
        full_description = request.form.get('fullDescription')
        product_category_name = request.form.get('productCategory')
        product_price = float(request.form.get('productPrice'))
        product_quantity = int(request.form.get('productQuantity'))  # Default quantity is 1

        if not (product_name and short_description and full_description and product_category_name and product_price):
            flash('Incomplete form data', 'error')
            return redirect(request.url)

        if 'productImages' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)

        files = request.files.getlist('productImages')

        image_url = None

        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                # Set the image_url to the path of the first uploaded image
                # This needs to be edited
                if image_url is None:
                    image_url = f"../static/img/uploads/{filename}"
            else:
                flash('Invalid file format', 'error')
                return redirect(request.url)

        category = Category.query.filter_by(name=product_category_name).first()
        if not category:
            flash('Invalid category', 'error')
            return redirect(request.url)

        new_product = Product(
            name=product_name,
            short_description=short_description,
            full_description=full_description,
            category_id=category.id,
            price=product_price,
            quantity=product_quantity,
            image_url=image_url,
            user_id=current_user.id
        )
        db.session.add(new_product)
        db.session.commit()

        flash('Item uploaded successfully', 'success')
        return redirect(url_for('user_settings'))
        


@app.route("/products/<int:id>", methods=['GET'])
def products_categories():
    page = request.args.get('page', 1, type=int)
    all_products = Product.query.paginate(page=page, per_page=10) 
    
    return render_template('products.html', title='Products', products=all_products)

@app.route("/search", methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        search_query = request.form.get('search', '')
    else:
        search_query = request.args.get('search', '')

    page=request.args.get('page', 1, type=int)
    if search_query:
        products = Product.query.filter(Product.name.ilike(f'%{search_query}%')).paginate(page=page, per_page=10)
    else:
        products = Product.query.paginate(page=page, per_page=10)

    return render_template('products.html', products=products, search_query=search_query)

        
@app.route('/remove_from_wishlist', methods=['POST'])
@login_required
def remove_from_wishlist():
    if current_user.is_authenticated:
        data = request.json
        product_id = data.get('product_id')
        user_id = current_user.id

        # Find the wishlist item and remove it
        Wishlist.query.filter_by(user_id=user_id, product_id=product_id).delete()
        db.session.commit()

        return jsonify({'message': 'Product removed from wishlist'}), 200
    else:
        return jsonify({'error': 'User not logged in'}), 401

    
@app.route('/add_to_wishlist', methods=['POST'])
@login_required
def add_to_wishlist():
    if current_user.is_authenticated:
        data = request.json
        product_id = data.get('product_id')
        user_id = current_user.id  # Use current_user.id for security

        existing_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            return jsonify({'message': 'Product already in wishlist'}), 200

        new_wishlist_item = Wishlist(user_id=user_id, product_id=product_id)
        db.session.add(new_wishlist_item)
        db.session.commit()
        return jsonify({'message': 'Product added to wishlist'}), 201

    return jsonify({'error': 'User not logged in'}), 401

# @app.route('/api/products')
# def api_products():
#     products = Product.query.all()
#     products_data = [{'id': product.id, 'name': product.name, 'price': product.price} for product in products]  # Add other necessary fields
#     return jsonify(products_data)

@app.route('/get_wishlist_items', methods=['GET'])
@login_required
def get_wishlist_items():
    user_id = current_user.id
    wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
    items = []
    for item in wishlist_items:
        product = Product.query.get(item.product_id)
        if product:
            items.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'short_description': product.short_description,
                'image_url': product.image_url,
                'quantity': product.quantity
            })
    return jsonify(items)

@app.route('/remove_wishlist_item/<int:item_id>', methods=['DELETE'])
@login_required
def remove_wishlist_item(item_id):
    user_id = current_user.id
    wishlist_item = Wishlist.query.filter_by(user_id=user_id, product_id=item_id).first()
    if wishlist_item:
        db.session.delete(wishlist_item)
        db.session.commit()
        return jsonify({'message': 'Wishlist item removed successfully'})
    else:
        return jsonify({'message': 'Wishlist item not found'}), 404
    
@app.route("/user_wishlist/<int:user_id>")
@login_required
def user_wishlist(user_id):
    if current_user.is_authenticated and current_user.id == user_id:
        # Fetching products from the user's wishlist
        wishlist_products = db.session.query(Product).join(Wishlist, Wishlist.product_id == Product.id).filter(Wishlist.user_id == user_id).all()

        # Now you can pass these products to your template to display them
        return render_template('user_wishlist.html', wishlist_products=wishlist_products)
    else:
        flash("You do not have permission to view this page.", "danger")
        return redirect(url_for('home'))






if __name__ == '__main__':
    app.run(debug=True)
