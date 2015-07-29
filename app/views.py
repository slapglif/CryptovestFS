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

@app.route('/register/create', methods=["GET", "POST"])
def create_account():
    output = render_template("dashboard/register.html")
    if request.form.get("remail1"):
        output = redirect(url_for("index"))
        email = request.form.get("remail2")
        if request.form.get("rpw") != None:
            password = request.form.get("rpw")
        else:
            password = "test"

        user = User(nickname=request.form.get("username"), email=email, password=password, email_confirmed=0)

        # Now we'll send the email confirmation link
        subject = "Confirm your email"

        token = ts.dumps(user.email, salt='email-confirm-key')

        confirm_url = url_for(
            'confirm_email',
            token=token,
            _external=True)

        html = render_template(
            'dashboard/email/activate.html',
            confirm_url=confirm_url)


        db_session.add(user)
        db_session.commit()
        checkbox = request.form.get("remember")
        login_user(user, checkbox)
        drill(user.email, subject, html)
        output = redirect(url_for("dashboard"))

    return output




@app.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = ts.loads(token, salt="email-confirm-key", max_age=86400)
    except:
        return "404"

    user = User.query.filter_by(email=email).first()

    user.email_confirmed = True
    session['user'] = user.id
    db_session.commit()


    return redirect('/dashboard')



@app.route("/lostpw")
def lostpw():
    return render_template('dashboard/lostpw.html')




@app.route("/login", methods=["GET", "POST"])
def login():

    if request.form.get("email"):
        user = User.query.filter_by(email=request.form.get("email")).first()
        if user.is_correct_password(request.form.get("password")):
            login_user(user, True)
            print "password is correct"
            session['user'] = user.id
            return redirect(url_for('dashboard'))
        else:
            print "password is not correct"
            return redirect(url_for('login'))
    print "no password"

    return render_template("dashboard/login.html")


@app.route("/dashboard")
def dashboard():

    user = None
    conf = None
    if 'user' in session:
        user = User.query.filter_by(id=session['user']).first()
        print user
        if user != None:
            conf = user.email_confirmed
        else:
            print "no"
    output = render_template('dashboard/index.html',user=user,conf=conf)

    return output



