from app import app, db
from flask_bcrypt import Bcrypt
from app.models import MyUser
from app.forms import RegistrationForm, LoginForm
from flask import render_template, redirect, url_for, flash, session, request



@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = MyUser(username=form.Username.data, email=form.Email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to login', 'success')
        return redirect(url_for('home'))
    return render_template('register.html', title='Register', form=form)

@app.route("/create_user")
def create_user():
    # Create a new user
    new_user = MyUser(username='example_user', email='user@example.com')
    db.session.add(new_user)
    db.session.commit()
    flash('New user created successfully!', 'success')
    return redirect(url_for('home'))

# @app.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return redirect(url_for('home'))


@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.Email.data == 'admin@application.com' and form.password.data == 'password':
            flash('You have been logged in!', 'success')
            return redirect(url_for('home'))
        else:
            flash("Login Unsuccessful. Please check username and password", "danger")
    return render_template('login.html', title='Login', form=form)

@app.route("/add_to_cart")
def add_to_cart():
    return render_template('add_to_cart.html', title='Add to Cart')

@app.route("/sell")
def sell():
    return render_template('sell.html', title='Sell')

@app.route("/contact")
def contact():
    return render_template('contact.html', title='Contact')

@app.route("/products")
def products():
    return render_template('products.html', title='Products')


@app.route("/product_details")
def productsDetails():
    return render_template('product_details.html', title='ProductsD')


@app.route("/user_profile")
def userProfile():
    return render_template('user_profile.html', title='User Profile')