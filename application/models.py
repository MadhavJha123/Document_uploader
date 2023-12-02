from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy_utils import URLType
from .database import db
from flask_security import UserMixin,RoleMixin


class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    active=db.Column(db.Boolean(),default=True)
    fs_uniquifier=db.Column(db.String(300),unique=True,nullable=True)
    
    is_ops_user = db.Column(db.Boolean, default=False)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    file=db.Column(db.LargeBinary, nullable=False)
    