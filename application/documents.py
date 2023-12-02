from flask_restful import Resource, fields, abort, marshal, reqparse,marshal_with
from .models import db, User, File
from flask_security import auth_required
from flask_mail import *
from flask_login import current_user
import json
from flask import jsonify,url_for,request,send_file
from itsdangerous import URLSafeSerializer
from flask_security.utils import hash_password
import base64
from io import BytesIO


file_parser = reqparse.RequestParser()
file_parser.add_argument('file', type=str, location='files')

file_field = {
    "id": fields.Integer,
    "filename": fields.String,
}

class DocumentAPI(Resource):
    @auth_required('token')
    def get(self):
        files=File.query.all()

        if files:
            result={
                "files":[marshal(p, file_field) for p in files]
            }
            return jsonify(result)
        else:
            return {'message': 'File not found'}, 404
            # return jsonify("files")
    
    @auth_required('token')
    def post(self):
        accepted_document=["pptx","docx","xlsx"]
        if current_user.is_ops_user:
            uploaded_file = request.files['file']
            if uploaded_file.filename.split(".")[-1] in accepted_document:

                if uploaded_file:
                    try:      
                        upload = File(filename=uploaded_file.filename, file=uploaded_file.read())
                        db.session.add(upload)
                        db.session.commit()

                        return {'message': 'Document uploaded successfully'}, 201
                    except Exception as e:
                        return {'message': f'Error uploading document: {str(e)}'}, 500
                else:
                    return {'message': 'No file uploaded'}, 400	
            else:
                abort(400,message="<h1>This file type is not allowed</h1>")
                        
        else:
            abort(400,message="You are not authorized to do this")