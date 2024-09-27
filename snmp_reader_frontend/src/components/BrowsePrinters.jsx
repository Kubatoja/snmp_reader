import { useEffect, useState, useRef } from "react";
import "../styles/printers.scss"
import { CiSearch } from "react-icons/ci";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { CSSTransition } from 'react-transition-group';
import { PopUpWindow } from "./PrintersPopUpWindow";


function BrowsePrinters({apiUrl, setInfo, handleReload, reload}) {
    const [input, setInput] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [data, setData] = useState([])
    const [popUpWindow, setpopUpWindow] = useState(false)
    const [deletingData, setDeletingData] = useState("")
    const [editData, setEditData] = useState("")
    const [error, setError] = useState("")
    const [popUpType, setPopUpType] = useState("")
    const nodeRef = useRef(null)


    const handleInputChange = (e) => {
        setInput(e.target.value)
    }
    useEffect(()=>{console.log(popUpType)},[popUpType])
    useEffect(() => {
        if (data && Array.isArray(data)) {
            const filtered = data.filter(printer => {
                const query = input.toLowerCase();
                // Check if properties are defined before calling toLowerCase
                const id = (printer._id || '').toLowerCase();
                const model = (printer.model || '').toLowerCase();
                const ip = (printer.ip || '').toLowerCase();
                const lease = (printer.lease || '').toLowerCase();
                const active = (printer.status || '').toLowerCase();
                
                const activeStatus = (active === "active") ? "active" : "inactive";

                return id.includes(query) || model.includes(query) || ip.includes(query) || lease.includes(query) || activeStatus.includes(query);
            });
            setFilteredData(filtered);
        }
    }, [input, data]);

    async function fetchData(){
        try {
          const response = await fetch(apiUrl+'printers/');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error.message);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [input, popUpWindow, reload]);
      
      async function deletePrinter(){
        try{
            const response = await fetch(apiUrl+`printers/id/${deletingData}/`, {
            method: 'DELETE',     
        });
        fetchData()
        handleReload()
        setInfo("deleted")

        }
        catch(error){
            setError(error.message)
        }
      }
    
      if (!data) {
        return <div>Loading...</div>;
      }

      useEffect(()=>{
        filteredData.map((printer)=>{
            console.log(printer.oid)
        })
      },[filteredData])
  return (
    <div className="browsePrinters">
        
        <CSSTransition
            in={popUpWindow}
            timeout={500}
            classNames='popUpWindow'
            unmountOnExit
            nodeRef={nodeRef}
        >
            <PopUpWindow setInfo={setInfo} popUpType={popUpType} setpopUpWindow={setpopUpWindow} editID={editData} popUpWindow={popUpWindow} deletePrinter={deletePrinter} nodeRef={nodeRef}/>

        </CSSTransition>
    
    

        <div className="searchBar">
            <input type="text" onChange={handleInputChange} value={input} placeholder="Search for printer..."></input>
            <div className="line">|</div>
            <div className="button">
                <CiSearch />
            </div>
        </div>
        
        <div className="searchResult">
        {error ? `Error: ${error}`:
        <>
            {filteredData.map((printer)=>(
                <Printer 
                    setPopUpType={setPopUpType} 
                    setpopUpWindow={setpopUpWindow} 
                    setDeletingData={setDeletingData}
                    setEditData={setEditData}
                    key={printer._id} 
                    id={printer._id} 
                    model={printer.model} 
                    active={printer.status == "active" ? "ACTIVE" :"INACTIVE"} 
                    ip={printer.ip} 
                    lease={printer.lease}
                    oids={printer.oid}
                />
            ))}
        </>
        }
            
        </div>
    </div>
  )
}

export default BrowsePrinters

function Printer({setPopUpType, setpopUpWindow, setDeletingData,setEditData, id, model, active, ip, lease="--", oids}){
    
    return(
        <div className="printer">
            <div className="top">
                <div className="info">
                    <div className="id">{id}</div>
                    <div className="model tag">{model}</div>
                    <div className={`tag ${active == "INACTIVE" ? "inactive" : ""}`}>{active}</div>
                </div>
                <div className="options">
                    <div className="delete">
                        <MdDeleteForever onClick={()=>{setpopUpWindow(true); setDeletingData(id); setPopUpType("delete")}}/>
                    </div>
                    <div className="edit">
                        <MdEdit onClick={()=>{setpopUpWindow(true); setEditData(id); setPopUpType("edit")}}/>
                    </div>
                </div>
            </div>
            <div className="middle">
                <div className="ipAddress">IP: {ip}</div>
                <div className="Lease">Leased from: {lease == "" ? "--" : lease}</div>
            </div>
            <div className="bottom">
                <div className="OIDS">OIDS: {oids ? Object.keys(oids).join(', ') : ""}</div>
            </div>
        </div>
    )
}