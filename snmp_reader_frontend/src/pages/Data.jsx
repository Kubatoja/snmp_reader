import { useEffect, useState } from "react";
import "../styles/data.scss"
import { CiSearch } from "react-icons/ci";
import { MdDownload,MdDeleteForever } from "react-icons/md";

function Data({apiUrl}) {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showStatus, setShowStatus] = useState("false");
    const [popUpWindow, setpopUpWindow] = useState(false);


    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const filtered = data.filter(data => {
                const query = input.toLowerCase();
                const name = (data.name || '').toLowerCase();
                const ip = (data.ip || '').toLowerCase();
                const lease = (data.lease || '').toLowerCase();
                const serial_No = (data.serial_No || '').toLowerCase();
                const location = (data.location || '').toLowerCase();
                const date = (data.date || '').toLowerCase();
                const model = (data.model || '').toLowerCase();
                const full_model = (data.model + " " +data.full_model || '').toLowerCase();


                
                return name.includes(query) || ip.includes(query) || lease.includes(query) 
                || serial_No.includes(query) || location.includes(query) || date.includes(query) 
                || model.includes(query) || full_model.includes(query);
            });
            setFilteredData(filtered);
        }
    }, [input, data]);

    async function fetchData() {
        setLoading(true);
        try {
            const response = await fetch(apiUrl+'data/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function handleDownload() {
        console.log("Downloading data");
        try {
            const response = await fetch(apiUrl+'data/download/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const currentDate = new Date().toISOString().split('T')[0];
            link.download = `data_${currentDate}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleForce() {
        console.log("Forcing request");
        try {
            const response = await fetch(apiUrl+'data/force/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchData();
        } catch (error) {
            console.error(error);
        }
        fetchData();  
        setShowStatus("end");  
    }


useEffect(() => {
    if (showStatus != "false") {
        const timer = setTimeout(() => {
            setShowStatus("false");
        }, 3000);
        return () => clearTimeout(timer);
    }
}, [showStatus]);


  return (
    <div className="data">
        <div className={`status ${showStatus != "false" ? "showStatus":""}`}>
            {showStatus === "start" ? "Starting manual forced request. It can take a few seconds" : ""}
            {showStatus === "end" ? "Data fetched!" : ""}
            {showStatus === "delete" ? "Data deleted succesfuly" : ""}
            

        </div>
        {popUpWindow ? <DataPopUpWindow apiUrl={apiUrl} setpopUpWindow={setpopUpWindow} fetchData={fetchData} setShowStatus={setShowStatus}/> : ""}
        <div className="dataContainer">
            <div className="nav">
                <div className="searchBar">
                    <input type="text" onChange={handleInputChange} placeholder="Search for printer..."></input>
                    <div className="line">|</div>
                    <div className="searchIcon">
                        <CiSearch className="icon"/>
                    </div>
                </div>
                <div className="button" onClick={()=>{handleForce(); setShowStatus("start")}}>Force request</div>
                <div className="button download" onClick={()=>{handleDownload()}}>Download CSV <MdDownload className="buttonIcon"/>
                </div>
                <div className="button delete" onClick={()=>{setpopUpWindow(true)}}>Bulk delete <MdDeleteForever className="buttonIcon" />
                </div>
            </div>
            
            <div className="displayData">
                    <DataItem topic={true} name={"NAME"} lease={"LEASE"} ip={"IP"} serial_no={"SERIAL NUMBER"} location={"LOCATION"} model={"MODEL"} full_model={""} date={"DATE"} time={""} pages_total={"TOTAL"} mono_pages={"MONO"} color_pages={"COLOR"}/>
                    {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="dataList">
                    {filteredData.map((data, index) => (
                        <DataItem
                        key={index}
                        name={data.name?.toString() || ''}
                        lease={data.lease?.toString() || ''}
                        ip={data.ip?.toString() || ''}
                        serial_no={data.serial_No?.toString() || ''}
                        location={data.location?.toString() || ''}
                        model={data.model?.toString() || ''}
                        full_model={data.full_model?.toString() || ''}
                        date={data.date?.toString() || ''}
                        time={data.time?.toString() || ''}
                        pages_total={data.pages_total?.toString() || ''}
                        mono_pages={data.mono_pages?.toString() || ''}
                        color_pages={data.color_pages?.toString() || ''}
                    />
                         
                    ))}
                </div>
            )}
            {error && <div className="error">{error}</div>}

               </div>    
            
        </div>
    </div>
  )
}

export default Data

function DataPopUpWindow({apiUrl, setpopUpWindow, fetchData, setShowStatus}){
    const [status, setStatus] = useState("none");
    const [data, setData] = useState("");   

    useEffect(() => {
        console.log(data);
    }, [data]);

   
async function bulkDelete() {
    let response;
    try {
        if (status === "serial") {
            response = await fetch(apiUrl+`data/?serial_No=${data}`, {
                method: 'DELETE',
            });
        } else if (status === "day") {
            response = await fetch(apiUrl+`data/?date=${data}`, {
                method: 'DELETE',
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        fetchData();
        setShowStatus("delete");
        console.log(result);
    } catch (error) {
        console.error('Error during bulk delete:', error);
    }
    
}
    return(
        <div className="dataPopUpWindowContainer">
            <div className="dataPopUpWindow">
                {status == "none" ? 
                <>
                <div className="options">
                    <div className="button" onClick={()=>{setStatus("serial")}}>Serial</div>
                    <div className="button" onClick={()=>{setStatus("day")}}>Day</div>
                 </div>
                 <div className="button" onClick={()=>{setStatus("none"); setpopUpWindow(false)}}>Cancel</div>
                 </>
                :""}
               {status == "serial" ? 
                <div className="serial">
                    <div className="options">
                    <input type="text" onChange={(e)=>{setData(e.target.value)}} placeholder="Serial number"></input>
                    <div className="buttonStatus" onClick={()=>{setStatus("none"); setpopUpWindow(false); bulkDelete()}}>Submit</div>
                    </div>
                    <div className="button" onClick={()=>{setStatus("none"); setpopUpWindow(false)}}> Cancel </div>
                </div>
               :""}
                {status == "day" ? 
                 <div className="serial">
                    <div className="options">
                      <input type="text" onChange={(e)=>{setData(e.target.value)}} placeholder="2024-09-20"></input>
                      <div className="buttonStatus" onClick={()=>{setStatus("none"); setpopUpWindow(false); bulkDelete()}}>Submit</div>
                      </div>
                        <div className="button" onClick={()=>{setStatus("none"); setpopUpWindow(false)}}> Cancel </div>
                </div> : ""}

            </div>

        </div>
    )
}

function DataItem({topic, name, lease, ip, serial_no, location, model, full_model, date, time, pages_total, mono_pages, color_pages}){
    return(
        <div className={`dataItem ${topic ? "topic":""}`}>
            <div className="dataItemFields">{name}</div>
            <div className="dataItemFields">{lease}</div>
            <div className="dataItemFields">{ip}</div>
            <div className="dataItemFields">{serial_no}</div>
            <div className="dataItemFields">{location}</div>
            <div className="dataItemFields">{model + " "+ full_model}</div>
            <div className="dataItemFields">{date+" "+time}</div>
            <div className="dataItemFields">{pages_total}</div>
            <div className="dataItemFields">{mono_pages}</div>
            <div className="dataItemFields">{color_pages}</div>
        </div>
    )
}