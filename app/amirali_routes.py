from flask import render_template
from app import app


# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/user_profile')
def about():
    return render_template('user_profile.html')

@app.route('/about_us')
def about_us():
    return render_template('about_us.html')