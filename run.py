from flask import Flask, render_template, url_for, flash, redirect
from app.forms import RegistrationForm, LoginForm


app = Flask(__name__)

import os
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

posts = [
{
    'author': 'Dhrumil Patel',
    'title': "Blog Post 01",
    'content': 'First post content',
    'date posted': 'April 20, 2018'
},
{
    'author': 'Mahi Patel',
    'title': "Blog Post 211",
    'content': 'Second post content',
    'date posted': 'April 21, 2018'
}
]


@app.route("/")
@app.route("/home")

def home():
    return render_template('home.html', posts =posts)


@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account created for {form.Username.data}!','success')
        return redirect(url_for('home')) 
    return render_template('register.html', title='Register', form=form)

@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.Email.data == 'admin@blog.com' and form.password.data == 'password':
            flash('You have been logged in!', 'success')
            return redirect(url_for('home'))
        else:
            flash("Login Unsuccessful. Please check username and password", "danger")
    return render_template('login.html', title='Login', form=form)

@app.route("/about")
def AddToCart():
    return render_template('AddToCart.html', title='AddToCart')

@app.route("/about")
def sell():
    return render_template('sell.html', title='AddToCart')

@app.route("/contact")
def contact():
    return render_template('contact.html', title='AddToCart')

if __name__ == "__main__":
    app.run(debug=True)






