import os
from app import app, db

from admin import admin
from models import *
from views import *

if __name__ == '__main__':
    BASE_DIR = os.path.realpath(os.path.dirname(__file__))
    DB_PATH = os.path.join(BASE_DIR, app.config['DATABASE_FILE'])

    if not os.path.exists(DB_PATH):
        db.create_all()

    # Start app
    app.config['DEBUG'] = True
    app.run(host='0.0.0.0')