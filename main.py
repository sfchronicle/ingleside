import os
import json
from app import app
from project import *

data = {
    'staging_path': app.config['STAGING_PATH'],
    'production_path': app.config['PRODUCTION_PATH']
}

with open('project.json', 'w') as outfile:  
	json.dump(data, outfile, indent=4)


if __name__ == '__main__':
	
	# Start app
	app.config['DEBUG'] = True
	app.run(host='0.0.0.0')
