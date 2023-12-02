from flask import Flask,render_template,redirect,url_for,send_file
from flask_restful import Api
from flask_security import auth_required,current_user
from io import BytesIO
from application.models import db,User,File
from application.resources import UserAPI, DownloadFile,mail,s
from application.documents import DocumentAPI
from application.security import sec,user_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'  
app.config['SECRET_KEY'] = 'testkey'
app.config['MAIL_SERVER']="smtp.gmail.com"
app.config['MAIL_PORT']=465
app.config['MAIL_USERNAME']='madhavjnvl@gmail.com'
app.config['MAIL_PASSWORD']="Enter your email application password"
app.config['MAIL_USE_TLS']=False
app.config['MAIL_USE_SSL']=True
app.config['SECURITY_PASSWORD_SALT'] = 'salt'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['WTF_CSRF_ENABLED'] = False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'

api = Api(app)
db.init_app(app)
sec.init_app(app, user_data)
mail.init_app(app)
app.app_context().push()

def create_db():
    db.create_all()

@app.route("/",methods=['GET'])
def index():
    return render_template("index.html")


from application.resources import user_credentials
@app.route("/confirm/<token>")
def confirm(token):
    from application.resources import verify_email
    ans=verify_email(token)
    return ans


@app.route("/download/<int:id>/<token>",methods=["GET"])
def download(id,token):
    try:
        if current_user.id:
            try:
                email=s.loads(token,salt="download-file")
            except:
                return "<h1>Link Expired</h1>"    
            file =File.query.filter_by(id=id).first()
            return send_file(BytesIO(file.file), 
                            download_name=file.filename, as_attachment=True)
    except:
        return "<h1>You are not authorized to access this url. Create an account to proceed</h1>"

# Resources registration
api.add_resource(UserAPI,'/user','/user/<int:id>')
api.add_resource(DownloadFile, '/download-file/<int:file_id>')
api.add_resource(DocumentAPI,'/documents')

if __name__ == '__main__':
    app.run(
        create_db(),
        debug=True)
