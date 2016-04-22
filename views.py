from flask import render_template, redirect, url_for

from app import app, db, freezer
from models import *


@app.route('/')
def index():
    return render_template('index.html', title='index')
