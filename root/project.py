from flask import render_template, redirect, url_for, request
from app import app, freezer

app.config['TEST_PROJECT_PATH'] = 'test-proj'
app.config['PROJECT_YEAR'] = '2017'

# Site paths
app.config['STAGING_PATH'] = ''
app.config['PRODUCTION_PATH'] = ''

# Category 
app.config['CATEGORY'] = ''

# Publication date 
app.config['DATE'] = '2017-01-01'

# Hashtag
app.config['HASHTAG'] = ''


@app.route("/")
def index():
  return render_template('index.html', 
  	hearst_class="channel", # All other pages will be 'article'
  	seo_title="",
  	title="",
  	description="",
  	twitter_text="")


# Additional Page template
'''
@app.route("/SLUG")
def SLUG():
  return render_template('index.html',
  	slug="", 
  	hearst_class="article",
  	seo_title="",
  	title="",
  	description="",
  	twitter_text="")
'''