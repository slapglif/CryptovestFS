##My Personal Boiler Plate for all FLASK Apps ##
from app.models import User
import re, requests, time, datetime
from app import app, engine, db_session
from mandril import drill
from flask import Flask, redirect, url_for, render_template, flash, request, session, g
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_user, logout_user, current_user
# from oauth import OAuthSignIn
from itsdangerous import URLSafeTimedSerializer
from subprocess import (PIPE, Popen)
from flask_oauth import OAuth
import json

app.config['SECRET_KEY'] = 'top secret!'

ts = URLSafeTimedSerializer(app.config["SECRET_KEY"])
lm = LoginManager(app)

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route('/')
def index():
    return render_template("/home/index.html")

@app.route('/register')
def reg():
    return render_template("dashboard/register.html")

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.form.get("email"):
        user = User.query.filter_by(email=request.form.get("email")).first()
        if user.is_correct_password(request.form.get("password")):
            login_user(user, True)
            print "password is correct"
            return redirect(url_for('dashboard'))
        else:
            print "password is not correct"
            return redirect(url_for('login'))
    print "no password"

    return render_template("dashboard/login.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard/index.html")