from app import app
from app.models import User, Product, Category, Rating
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
        flash(f'Account created for {form.Username.data}!', 'success')
        return redirect(url_for('home'))
    return render_template('register.html', title='Register', form=form)

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

if __name__ == "__main__":
    app.run(debug=True)