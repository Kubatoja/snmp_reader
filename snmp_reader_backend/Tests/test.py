import asyncio, csv, json
from puresnmp import Client, V2C, PyWrapper, V3, Auth, Priv

#iso.3.6.1.2.1.1.6.0

async def snmp_poller_V2C(ip_address, com, oid): 
      port = 161
      if com=="B0wimK0nic42024":
         port = 2161
         
      try:
         client = PyWrapper(Client(ip_address, V2C(com), port=port))
   
         output = await client.get(oid)

         return(output)
      except Exception:
         return("error")




















# with open('printers.csv') as printers:
#    printerId = 0
#    printersCSV = csv.reader(printers)
#    for row in printersCSV:
#       ipAdress = row[0]
#       com = row[1]
#       com = com.strip()
#       for oid in row[2:]:
#          oid = oid.strip()
#          asyncio.run(SNMPoller(ipAdress, com, oid, printerId))


# credits = V3(username="konicaread", auth=Auth("&gXirF@*wwM6RePaay", "sha1"), priv=Priv("&gXirF@*wwM6RePaay","aes"))
# async def snmp_poller_V3():
#       client = PyWrapper(Client("10.0.5.37", port=2161, credentials=credits))
#       output = await client.get("iso.3.6.1.2.1.1.6.0")
#       print(output)
#