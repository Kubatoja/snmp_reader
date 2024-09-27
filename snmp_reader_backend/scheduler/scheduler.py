import schedule
import time as tm
from . import variables
from database.database_app_connection import *
from snmp_poller.snmp_poller import Snmp_poller
import logging 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

SNMPP = Snmp_poller()
retry_jobs = []

def scheduler():
    try:
        main_scheduler_time = scheduler_time("main_scheduler")
        main_scheduler_day = scheduler_day("main_scheduler")
        retry_scheduler_timing = int(scheduler_time("retry_scheduler"))
        retry_scheduler_retries_count = int(retry_scheduler_retries())
    except Exception:
        logging.error("Database connection timeout.")
        return
    
    def main():
        logging.info("Starting main task")
        main_task = SNMPP.execute_for_all()
        for device in main_task:
            counter = [0]
            retry_job = schedule.every(retry_scheduler_timing).minutes.do(retry, ip_address=device[0], id=device[1], counter=counter )
            retry_jobs.append(retry_job)
            

    def retry(ip_address, id, counter):
            counter[0] +=1
            logging.info("Retrying for id=%s, ip_address=%s", id, ip_address)
            retry_request = SNMPP.execute_for_one(ip_address=ip_address, id=id)
            if retry_request != -1 or counter[0] >= retry_scheduler_retries_count:
                logging.warning("Canceling job")
                return schedule.CancelJob

    def cancel_all_retries():
        global retry_jobs

        for job in retry_jobs:
            schedule.cancel_job(job)

        retry_jobs.clear()
    
    # main()
    
    # schedule.every(main_scheduler_timing).minutes.do(lambda: [cancel_all_retries(), main()])

# Schedule the task at 00:00 on the specified day
    
    match main_scheduler_day:
        case "Monday":
            schedule.every().monday.at(main_scheduler_time).do(lambda: [cancel_all_retries(), main()])
        case "Tuesday":
            schedule.every().tuesday.at(main_scheduler_time).do(lambda: [cancel_all_retries(), main()])
        case "Wednesday":
            schedule.every().wednesday.at(main_scheduler_time).do(lambda: [cancel_all_retries(), main()])
        case "Thursday":
            schedule.every().thursday.at(main_scheduler_time).do(lambda: [cancel_all_retries(), main()])
        case "Friday":
            schedule.every().friday.at(main_scheduler_time).do(lambda: [cancel_all_retries(), main()])

    while True:
        schedule.run_pending()
        tm.sleep(1)

        # logging.info("[dev] Jobs: %d", len(schedule.get_jobs()))

