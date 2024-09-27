import os

#------------CHANGE HERE--------------------------------

uri = os.getenv("MONGODB_URI")
database_name = "snmp_poller"
database_device_collection = "printers"
database_data_collection = "data"
database_scheduler_collection = "scheduler"

#-------------------------------------------------------
