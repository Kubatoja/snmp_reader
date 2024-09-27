from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_cors import CORS
from database.database_api_connection import *
from .helpers import flatten_json, convert_json_to_csv
from datetime import datetime
from snmp_poller.snmp_poller import Snmp_poller
from waitress import serve

SNMP = Snmp_poller()
app = Flask(__name__)
api = Api(app)

CORS(app)

class Download(Resource):
    def get(self):
        try:
            json = get_data()

            flatten_json_data = flatten_json(json)
            csv_data = convert_json_to_csv(flatten_json_data)
            
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"data_{current_date}.csv"

            response = make_response(csv_data)
            cd = f'attachment; filename={filename}'

            response.headers['Content-Disposition'] = cd 
            response.mimetype='text/csv'

            response.status_code = 200
            response.headers['Custom-message'] = "Download successful"

            return response
        except Exception as e:
            return {"error":str(e)}
    
api.add_resource(Download, "/data/download/")

class Data(Resource):
    def get(self):

        filters = request.args.to_dict()

        result = get_data(**filters)
        return result
    
    def delete(self, id=None, serial_No=None):
        filters = request.args.to_dict()

        if 'serial_No' in filters:
            result = delete_data(serial_No=filters.get('serial_No')), 200
        elif "id" in filters:
            result = delete_data(id=filters.get('id')), 200
        elif 'date' in filters:
            result = delete_data(date=filters.get('date')), 200
        else:
            result = delete_all_data(), 200
        
        return result

api.add_resource(Data, '/data/')

class Printers(Resource):
    def get(self):
            filters = request.args.to_dict()

            result = get_printers(**filters)
            return result
    
    def delete(self, id):
            result = delete_printer(id)
            return result
        
    def put(self, id):
        try:
            data = request.get_json()
            result = update_printer(id, data)

            if result.matched_count == 1:
                return {'message': 'Document updated successfully!'}, 200
            else:
                return {'message': 'Document not found!'}, 404
        except Exception as e:
            return {'error': str(e)}, 500
        
    def post(self):
        data = request.get_json()

        if not data:
            return {'error' : 'No input data provided'}, 400
            
        insertion = insert_printer(data=data)
        
        if insertion and insertion[1] == 500:
            return insertion[0]
        
        return {'message': 'Item added'}, 201

api.add_resource(Printers, '/printers/', '/printers/id/<string:id>/')

class Scheduler(Resource):
    def get(self, id=None):
        result = get_schedulers(id)
        return result
    def put(self, id):
        try:
            data = request.get_json()
            result = update_scheduler(id,data)

            if result.matched_count == 1:
                return {"message":"Document updated successfully!"}, 200
            else:
                return {'message':"Document not found!"}, 404
        except Exception as e:
            return {'error': str(e)}, 500


api.add_resource(Scheduler, '/scheduler/', '/scheduler/<string:id>')

class ForceRq(Resource):
    def get(self):
        result = SNMP.execute_for_all()
        return result
api.add_resource(ForceRq, '/data/force/')


def start_api():
    serve(app, host="0.0.0.0", port=8080)
