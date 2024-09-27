from pymongo import MongoClient
from . import database_variables

client = MongoClient(database_variables.uri)
db = client[database_variables.database_name]
printer_collection = db[database_variables.database_device_collection]
data_collection = db[database_variables.database_data_collection]
scheduler_collection = db[database_variables.database_scheduler_collection]


#return names of all models in database
def printers_id():
    results = printer_collection.find()
    results_array = []
    for result in results:
        results_array.append(result["_id"])
    return(results_array)

def is_printer_active(id):
    result = printer_collection.find_one({"_id":id})
    return result["status"]

#return array of all ip numbers for a given model name
def printers_ip(id):
    results = printer_collection.find_one({"_id":id})
    return(results["ip"])


#return community string for a given model name (only for models working on SNMP v2 and v2c)
def printers_com(id):
    results = printer_collection.find_one({"_id":id})
    if (results["version"]=="2c" or results["version"]=="2") :
        return(results["com"])
    else:
        return -1
    
#return array of all oid numbers for a given model name
def printers_oid(id):
    results = printer_collection.find_one({"_id":id})
    return results["oid"]



def printer_model(id):
    result = printer_collection.find_one({"_id":id})
    return result["model"]


def printers_version(model):
    results = printer_collection.find_one({"model":model})
    return(results["version"])


def database_insert(dictionary):
    data_collection.insert_one(dictionary)

def scheduler_time(scheduler):
    result = scheduler_collection.find_one({"_id":scheduler})
    return result["time"]
def scheduler_day(scheduler):
    result = scheduler_collection.find_one({"_id":scheduler})
    return result["day"]


def retry_scheduler_retries():
    result = scheduler_collection.find_one({"_id":"retry_scheduler"})
    return result["retries"]

def get_lease(ip_address):
    result = printer_collection.find_one({"ip":ip_address})
    return result["lease"]