<h3 align="center">SNMP reader</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A project that pull data from SNMP devices based on Python and MongoDB. Feel free to ask any questions :D
    <br> 
</p>

## 📝 Table of Contents

- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Frontend customization](#-frontend-customisation)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need an SNMP service on your PC and net-snmp 5.7.0 or newer. Then you want to:

```
pip install -r requirements.txt
```

### Installing

A step by step series of examples that tell you how to get a development env running.

Install mongoDB, create database.

Create 3 collections: data, printers, scheduler

In printers each document should be a single device.

Documents should look like that, you can also add those by frontend app:

```json
//ALL FIELDS BESIDE OPTIONAL ARE REQUIRED FOR THE APP TO WORK PROPERLY
{
  "_id": "printer_1",
  "model": "modelName",
  "lease": "companyName",
  "status": "active/inactive",
  "version": "2/2c",
  "ip": "10.0.0.1",
  "com": "BowimXer0xx",
  "oid": {
    "name": "1.2.3.4.5.6.7.8.9.1.2.3.4.5.6",
    "pages_total": "1.2.3.4.5.6.7.8.9.10.11.12.13.14",
    "location": "1.2.3.4.5.6.7.8.9.10.11.12.13.14",
    "serial_no": "1.2.3.4.5.6.7.8.9.10.11.12.13.14",
    "full_model": "1.2.3.4.5.6.7.8.9.10.11.12.13.14",
    "color_pages": "", //Optional
    "mono_pages": "" //Optional
  }
}
```

#### REQUIRED adding schedulers to database:

```json
{
  "_id": "main_scheduler",
  "time": "08:26",
  "day": "friday"
},
{
  "_id": "retry_scheduler",
  "retries": 5,
  "time": 30
}
```

Then you want to connect to your database - ./database/database_connection.py

```py

#------------CHANGE HERE--------------------------------

uri = "<your uri>"
database_name = "myDB"
database_collection = "printers"

#-------------------------------------------------------


```

You are good to go

<!-- ## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
``` -->

## 🍄 Frontend customisation:

In snmp_reader_frontend/src/styles/colors.scss - you can change your color palette to fit your company.

In snmp_reader_frontend/src/img/ - you can replace logo.jpg to your logo.

## 🎈 Usage <a name="usage"></a>

Just run the script:

```
Desktop\snmp_reader> python run.py
```

### IMPORTANT:

```
If any change is made to schedulers in database the program also need to be restarted!
```

### API USAGE:

```py
1. Printers collection:
- options:
[GET] /printers/ #returns all data from printers collection

[GET] /printers/?name=<name>&model=<model> # ability to use dynamic filters for getting printers data

[DELETE] /printers/<id> # By passing id after in delete request you can remove printers one by one

[PUT] /printers/<id> # By passing id in PUT request and json data you can modify as much data as you want

[POST] /printers/ # by passing POST request and JSON data in correct format you can add new printer

2. Data collection:
-options:
[GET] /data/ #returns all data

[GET] /data/?id=<id>&serial_No=<serial number> # data also supports dynamic filters

[GET] /data/download #download a CSV file of all current data in DB

[DELETE] /data/?id=<id> / /data/?serial_No=<serial_No> / /data/  #deletes data either by serial number or id. *IF NONE PROVIDED, ALL DATA WILL BE DELETED*

3. Scheduler collection:
[GET] /scheduler/ #returns all data from scheduler collection

[GET] /scheduler/<id> #returns data for specified scheduler - main_scheduler/retry_scheduler

[PUT] /scheduler/<id> #by passing json data through PUT request giving id you can modify specific scheduler attributes such as time and (only retry) how many retries
```

## 🚀 Deployment <a name = "deployment"></a>

#### Each time you change something in schedulers you need to restart the app.

In database there are two defined schedulers. Data is pulled once a week. You can define a specific day and time <br>
In retry scheduler there is a count attribute which define how many retries app should make and then stop trying till next main scheduler run and time attrivute that tells in minutes delay between retries.

## ⛏️ Built Using <a name = "built_using"></a>

- [Python](https://www.python.org/) - Programing language
- [MongoDB](https://www.mongodb.com/) - Database
- [Flask](https://flask.palletsprojects.com/) - Server Framework

## ✍️ Author <a name = "authors"></a>

- [@kubatoja](https://github.com/kubatoja)

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
