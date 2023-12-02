from flask_restful import Resource, fields, abort, marshal, reqparse
from .models import db, User, File
from .security import user_data
from flask_security import auth_required
from flask_mail import *
from flask_login import current_user
import json
from flask import jsonify,url_for
from itsdangerous import URLSafeSerializer,TimedSerializer as Serializer
from flask_security.utils import hash_password

mail=Mail()
s=URLSafeSerializer("secret-key")
file_parser = reqparse.RequestParser()
file_parser.add_argument('file', type=str, location='files')

user_args = reqparse.RequestParser()
user_args.add_argument("email", type=str)
user_args.add_argument("password", type=str)

user_field = {
    "id": fields.Integer,
    "email": fields.String
}
user_credentials = None
def verify_email(token):
    try:
        email=s.loads(token,salt="email-confirmation-key",max_age=300)
    except:
        return "<h1>Link Expired</h1>"    
    e=User.query.filter_by(id=1).first()
    if not e:
        user=User(email=user_credentials['email'], password=user_credentials['password'], is_ops_user=True)
        db.session.add(user)
        db.session.commit()    
    else:
        user=User(email=user_credentials['email'], password=user_credentials['password'])
        db.session.add(user)
        db.session.commit()    
    return "<h1>Email verified</h1><br><a href='/'>Go to login page</a>"


user_credentials=None
class UserAPI(Resource):
    #@auth_required('token')
    def get(self, id=None):
        user=User.query.filter_by(id=id).first()
        result = {
                "user": marshal(user, user_field),
            }
        return jsonify(result)

    def post(self):
        args = user_args.parse_args()
        email = args.get("email")
        password = args.get("password")
        hashed_password=hash_password(password)
        check_user=User.query.filter_by(email=email).first()
        global user_credentials
        user_credentials = {"email": email, "password": hashed_password}

        if check_user:
            abort(400, message="email already exists!")
        else:
            def verify(gmail):
                token=s.dumps(gmail,salt='email-confirmation-key') 
                msg=Message("Confirmation",sender="madhavjnvl@gmail.com",recipients=[gmail])
                link=url_for("confirm",token=token,_external=True)
                msg.body="Your verification link is "+link
                mail.send(msg)
                return token
            
            if verify(email):
                json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
            else:
                return "<h1>Enter a valid email address</h1>"   
            return "<h1>Check your email for verification</h1>"
            
class DownloadFile(Resource):
    @auth_required('token')
    def get(self, file_id):
        token=s.dumps(file_id, salt="download-file")
        link=url_for("download",id=file_id,token=token,_external=True)
        msg=Message("Download link",sender="madhavjnvl@gmail.com",recipients=[current_user.email])
        msg.body="Here is the link of the file to download which you requested "+link
        mail.send(msg)
        result={
            "download-link":link,
            "message":"success"
        }
        response = jsonify(result)
        response.status_code = 200
        return response
    