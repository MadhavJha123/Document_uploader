from flask_security import Security, SQLAlchemyUserDatastore
from .database import db 
from .models import User

user_data = SQLAlchemyUserDatastore(db, User,role_model=None)
sec=Security()