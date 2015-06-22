from datetime import datetime
from app import db

# Create models here


class Example(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.Unicode(64))
    body = db.Column(db.UnicodeText())

    created_on = db.Column(db.DateTime(), default=datetime.utcnow)
    updated_on = db.Column(
        db.DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, headline="", body=""):
        self.headline = headline
        self.body = body

    def __repr__(self):
        return '<Example - {}>'.format(self.headline)
