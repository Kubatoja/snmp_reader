import "../styles/scheduler.scss"
import { useEffect, useState } from "react"

function Scheduler({apiUrl}) {
    const [day, setDay] = useState("Friday");
    const [time, setTime] = useState("15:11");
    const [retryEvery, setRetryEvery] = useState("120");
    const [retryTimes, setRetryTimes] = useState("6");
    const [info, setInfo] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(apiUrl+'scheduler/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setDay(result[0].day);
                setTime(result[0].time);
                setRetryEvery(result[1].time);
                setRetryTimes(result[1].retries);
            } catch (error) {
                console.error('Error during data fetch:', error);
            } finally {
                console.log('Data fetched');
            }
        }
        
        fetchData();
    }, []);
    async function updateMainScheduler(){
        try {
            const response = await fetch(apiUrl+'scheduler/main_scheduler', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    day: day,
                    time: time,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error during data fetch:', error);
        } finally {
            console.log('Data fetched');
        }
    }

    async function updateRetryScheduler(){
        try {
            const response = await fetch(apiUrl+'scheduler/retry_scheduler', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    time: parseInt(retryEvery),
                    retries: parseInt(retryTimes),
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error during data fetch:', error);
        } finally {
            console.log('Data fetched');
            setInfo(true);
        }
    }

    useEffect(() => {
        if (info === true) {
            const timer = setTimeout(() => {
                setInfo(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [info]);
return (
    <div className="scheduler">
        <div className={`info ${info ? "showInfo" : ""}`}>Schedulers updated succesfuly!</div>
            <div className="schedulerContainer">
                    <div className="schedulerItem">
                            <h1>Main Scheduler</h1> 
                            <p>Pull data every 
                                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                    </select>
                                    at  <input type="time" value={time} onChange={(e) => setTime(e.target.value)}></input>
                                    </p>
                    </div>
                    <div className="schedulerItem">
                            <h1>Retry Schedulers</h1>
                            <p>Retry every: 
                                <input type="text" value={retryEvery} onChange={(e) => setRetryEvery(e.target.value)}></input> 
                                minutes,
                                <input type="text" value={retryTimes} onChange={(e) => setRetryTimes(e.target.value)}></input> 
                                times.
                            </p>
                    </div>
                    <div className="schedulerButton" onClick={()=>{updateMainScheduler(); updateRetryScheduler()}}>   Update</div>
                    <div className="schedulerNote">
                    *Note that every change made here requires the app to be restarted
                    </div>

            </div>
    </div>
)
}

export default Scheduler
