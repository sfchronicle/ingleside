import flask_admin as admin
# from flask_admin.contrib.sqla import ModelView

from app import app
# from app import db
from models import *

# Admin
admin = admin.Admin(app)

# Add Admin Views
