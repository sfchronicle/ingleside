import os
from app import app
from views import *

# Start app
app.config['DEBUG'] = True
app.run(host='0.0.0.0')