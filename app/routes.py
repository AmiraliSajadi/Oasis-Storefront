from app import app, db, bcrypt
from flask_bcrypt import Bcrypt
from app.models import MyUser
from app.forms import RegistrationForm, LoginForm
from flask import render_template, redirect, url_for, flash, session, request
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


@app.route("/userProfile")
@login_required
def userProfile():
    return render_template('userProfile.html', title='User Profile')