from collections.abc import Sequence
from typing import Any, Mapping
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, TextAreaField ;
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError;
from app.models import MyUser


class RegistrationForm(FlaskForm):
    Username = StringField('Username',validators=[DataRequired(), Length(min=2, max=20)])
    Email = StringField('Email',validators=[DataRequired(), Email()])
    password = PasswordField('Password',validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',validators=[DataRequired(), EqualTo('password')])

    submit = SubmitField('Sign Up')
    
    def validate_username(self, Username):
        user = MyUser.query.filter_by(Username=Username.data).first()
        if user:
            raise ValidationError('Username already exist! Please choose a different one.')
        
    def validate_email(self, Email):
        Email = MyUser.query.filter_by(Email=Email.data).first()
        if Email:
            raise ValidationError('Email already exist! Please choose a different one.')



class LoginForm(FlaskForm):
    Email = StringField('Email',validators=[DataRequired(), Email()])
    password = PasswordField('Password',validators=[DataRequired()])

    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class PostForm(FlaskForm):
    name = StringField('Name',validators=[DataRequired()])
    price = StringField('price',validators=[DataRequired()])
    shortdesc = StringField('shortdec',validators=[DataRequired()])
    fulldesc = StringField('fulldesc',validators=[DataRequired()])
    img_url = StringField('img_url',validators=[DataRequired()])
    category_id = StringField('category_id',validators=[DataRequired()])
    quantity = StringField('quantity',validators=[DataRequired()])
    submit = SubmitField('Post')