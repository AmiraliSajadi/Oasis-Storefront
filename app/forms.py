from collections.abc import Sequence
from typing import Any, Mapping
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField ;
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
        user = MyUser.query.filter_by(Email=Email.data).first()
        if user:
            raise ValidationError('Email already exist! Please choose a different one.')



class LoginForm(FlaskForm):
    Email = StringField('Email',validators=[DataRequired(), Email()])
    password = PasswordField('Password',validators=[DataRequired()])

    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')
