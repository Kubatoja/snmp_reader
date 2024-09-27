from pymongo import MongoClient
from bson import ObjectId
from . import database_variables
from . import helpers
from pymongo.errors import PyMongoError

client = MongoClient(database_variables.uri)
db = client[database_variables.database_name]
printer_collection = db[database_variables.database_device_collection]
data_collection = db[database_variables.database_data_collection]
scheduler_collection = db[database_variables.database_scheduler_collection]

def get_data(**filters):
    try:
        query = {}
        
        if 'id' in filters:
            try:
                filters['_id'] = ObjectId(filters.pop('id'))
            except Exception as e:
                return {'error': 'Invalid ObjectId format'}, 400  # Return error if invalid ObjectId

        for key,value in filters.items():
            if value is not None:
                query[key] = {"$regex": value, "$options": "i"}

        if not query:
            results = data_collection.find()
        else:
            results = data_collection.find(query)

        return helpers.parseJson(results)
    except Exception as e:
        return {'error' : str(e)}, 500
    
def delete_data(id=None, serial_No=None, date=None):
    try:
        if id:
            data_collection.delete_one({"_id": ObjectId(id)})
            return {'success':'Data has been deleted'}, 200
        if serial_No:
            data_collection.delete_many({"serial_No": serial_No})
            return {'success':'Data has been deleted'}, 200
        if date:
            data_collection.delete_many({"date": date})
            return {'success':'Data has been deleted'}, 200
    except PyMongoError as e:
        return {'error' : str(e)}, 500

def delete_all_data():
    try:
        data_collection.delete_many({})
        return {'success':'All data has been deleted'}, 200
    except PyMongoError as e:
        return {'error' : str(e)}, 500
def get_printers(**filters):
    try:
        query = {}

        if 'id' in filters:
            filters["_id"] = filters["id"]
            filters.pop("id")
        for key,value in filters.items():
            if value is not None:
                query[key] = value

        if not query:
            results = printer_collection.find()
        else:
            results = printer_collection.find(query)

        return helpers.parseJson(results)

    except PyMongoError as e:
        return {'error' : str(e)}, 500
    
def insert_printer(data):
    try:
        result = printer_collection.insert_one(data)
    except PyMongoError as e:
        return {'error' : str(e)}, 500
    

def delete_printer(id):
    try:
        result = printer_collection.delete_one({"_id":id})
          # Check how many documents were deleted
        if result.deleted_count == 0:
            return {'message': 'No printer found with this ID'}, 404
        else:
            return {'message': 'Printer deleted successfully'}, 200

    except PyMongoError as e:
        return {'error' : str(e)}, 500

def update_printer(id, data):
    
    result = printer_collection.update_one({"_id":id}, {"$set" : data})
    return result

def get_schedulers(id=None):
    try:
        if id is None:
            result = scheduler_collection.find()
            return helpers.parseJson(result)
        if id:
            result = scheduler_collection.find_one({"_id":id})
            return helpers.parseJson(result)   
    except PyMongoError as e:
        return {'error' : str(e)}, 500
    

def update_scheduler(id, data):
    result = scheduler_collection.update_one({"_id":id}, {"$set": data})
    return result