from flask import Flask
from flask_frozen import Freezer
from flask_assets import Environment

# Create application
app = Flask(__name__)

# asset management
assets =  Environment(app)
assets.config['CACHE'] = '.webassets-cache'

# building
freezer = Freezer(app)