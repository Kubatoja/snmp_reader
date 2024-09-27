from database.database_app_connection import *
from puresnmp import Client, V2C, PyWrapper
from . import helpers
import asyncio, datetime

import logging 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Snmp_poller:
   def __init__(self):
      self.result = []
   
   #function that takes ip address, community adress and oid, then makes a snmp request and return a value
   async def snmp_poller_V2C(self, model, ip_address, com, oid): 
      port = 161
      if model=="KONICA" or model=="SHARP":
         port = 2161
         
      try:
         client = PyWrapper(Client(ip_address, V2C(com), port=port))
         try: 
            async with asyncio.timeout(10):
               output = await client.get(oid)
               return(output)
         except TimeoutError:
            return "timeout"
      except Exception:
         return "error"
   
   #function that execute connection to database (./database/database_connection.py) and runs poller with arguments from DB
   def execute_for_all(self):
      failed = []
      try:
         #Pull model names of all devices, if doesnt work -> database is not responding
         printers_ids = printers_id()
      except Exception:
         logging.error("Database refused connection.")
         return -2 #code for not responding database
      
      #loop through all the model names and pull ip of all devices by name
      for id in printers_ids:
         ip_address = printers_ip(id)
         
         request = self.execute_for_one(ip_address, id)

            # if request returns code -1 (timeout), address is added to failed list
         if request == -1:
            failed.append([ip_address, id])

      #returns list of ip and model of all devices that returned code -1
      return failed
   
   async def snmp_request_wrapper(self, model, ip_address, com, oid):
      result = await self.snmp_poller_V2C(model, ip_address, com, oid)
      if result == "timeout" or result == "error":
         logging.warning("Request has reached a timeout or error. Retrying in a while")
         raise ValueError()
      return result
   
      
   #function that execute SNMP request for all OID's of a single device with specific IP and model name,
   def execute_for_one(self, ip_address, id):
      if(is_printer_active(id) == "active"):
         com = printers_com(id)
         oids = printers_oid(id)
         model = printer_model(id)
         
         async def run_async_tasks():
            name = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["name"])
            location = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["location"]),
            serial_no = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["serial_no"]),
            pages_total = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["pages_total"])
            mono_pages = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["mono_pages"]) if "mono_pages" in oids else 0
            color_pages = await self.snmp_request_wrapper(model=model, ip_address=ip_address, com=com, oid=oids["color_pages"]) if "color_pages" in oids else 0

            return [name, location, serial_no, pages_total, mono_pages, color_pages]
         try: 
            name, location, serial_no, pages_total, mono_pages, color_pages = asyncio.run(run_async_tasks())
            self.save_data(name=name, location=location, serial_no=serial_no, pages_total=pages_total, model_name=model, ip_address=ip_address, color_pages=color_pages, mono_pages=mono_pages)
            return 1
         except Exception as e:
            print(e)
            return -1

   #function that save pulled data to database by creating a dictionary.
   def save_data(self, name, location, serial_no, pages_total, model_name, ip_address, color_pages, mono_pages):
      try:
         name = helpers.cut_word(str(name))
        
         serial_no = helpers.cut_word(str(serial_no))
         location = helpers.cut_word(str(location))
         date = datetime.datetime.now()
         date_converted = str(date.year)+"-"+str(date.month)+"-"+str(date.day)
         if(date.minute < 10):
            time = str(date.hour)+":0"+str(date.minute)
         else:
            time = str(date.hour)+":"+str(date.minute)
         dictionary = {
            "name": name,
            "lease": get_lease(ip_address),
            "ip" : ip_address,
            "serial_No" : serial_no,
            "location" : location,
            "model": model_name,
            "date" : date_converted,
            "time": time,
            "pages_total": pages_total,
            "mono_pages": mono_pages,
            "color_pages" : color_pages
         }
         database_insert(dictionary)
         logging.info("Data successfully saved.")
      #if something goes wrong it return a code -3 (failed to save data)
      except Exception as e:
         logging.error("failed to save data.", exc_info=True)
         return -3
