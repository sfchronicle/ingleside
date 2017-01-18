import os
import sys

from app import app, assets, Environment, freezer
from views import *

BUILD_DIR = os.path.join(os.path.realpath(os.path.dirname(__file__)), 'build')
ROOT_URL = '//extras.sfgate.com'

# CHANGE THE FOLDER SLUG TO NEW PROJECT 
TEST_PROJECT_NAME = 'test-proj/CHANGE-ME'
PROJECT_NAME = '2016/CHANGE-ME'


if __name__ == '__main__':
    app.config['DEBUG'] = False
    app.config['ASSETS_DEBUG'] = True

    args = sys.argv[1:]
    
    if args:
        for arg in args: 
            if arg == 'staging':
                app.config['FREEZER_BASE_URL'] = '{}/{}'.format(ROOT_URL, TEST_PROJECT_NAME)
                freezer.freeze()

            elif arg == 'production':
                app.config['FREEZER_BASE_URL'] = '{}/{}'.format(ROOT_URL, PROJECT_NAME)
                freezer.freeze()

    else:
        print('Please specify whether to build for `staging` or for `production`')