import threading
from scheduler.scheduler import scheduler
from poller_api.pollerapi import start_api
from database.database_app_connection import * 

def run():

    # start_api()
    # scheduler()
    scheduler_thread = threading.Thread(target=scheduler)
    api_thread = threading.Thread(target=start_api)

    scheduler_thread.start()
    api_thread.start()

if __name__ == '__main__':
    run()

    
            