import "../styles/sidepanel.scss"
import { AiFillSchedule } from "react-icons/ai";
import { FiPrinter } from "react-icons/fi";
import { FaDatabase } from "react-icons/fa";
import { useState } from "react";


function Sidepanel({page, setPage}) {
 

  return (
    <div className="sidepanel">
      <div className="project">
        <div className="logo"></div>
        <div className="projectName">SNMP READER</div>
      </div>
      <div className="menu">
        <div className={`option ${page == "printers" ? "active":""}`}  onClick={()=>{setPage("printers")}}>
          <div className="indicator"></div>
          <FiPrinter className="icon"/>
          Printers
        </div>
        <div className={`option ${page == "data" ? "active":""}`}  onClick={()=>{setPage("data")}}>
          <div className="indicator"></div>
          <FaDatabase className="icon"/>
          Data
        </div>
        <div className={`option ${page == "scheduler" ? "active":""}`}  onClick={()=>{setPage("scheduler")}}> 
          <div className="indicator"></div>
          <AiFillSchedule className="icon"/>
          Scheduler
        </div>

      </div>

    </div>
  )
}

export default Sidepanel
