import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

export function PopUpWindow({ setInfo, popUpType, setpopUpWindow, editID, deletePrinter, nodeRef }) {

    const [editOption, setEditOption] = useState("")
    const [secondOption, setSecondOption] = useState(false)
    const [editData, setEditData] = useState("")
    const [tempData, setTempData] = useState("")

    function handleOptions(option){
        setEditOption(option)
        setSecondOption(true)
    }

    async function sendEditData(){
        if (editOption === "model") {
            setEditData(editData.toUpperCase());
        }
        const data = {
            [editOption]: editData
        }
        try {
            const response = await fetch(`http://localhost:8080/printers/id/${editID}/`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
              mode: "cors"
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const responseData = await response.json();
            console.log(data);
          } catch (error) {
            console.error('Error fetching printer data:', error);
          }
          setpopUpWindow(false)
          setInfo("updated")
    }

    useEffect(()=>{
        if(editData){
            sendEditData()
        }
    }, [editData])


    return (
        <div className="popUpWindow" ref={nodeRef}>
            {popUpType == "delete" ?
                <div className="deleteWindow">
                    <div className="top">
                        <IoIosClose className="icon" onClick={() => { setpopUpWindow(false); }} />

                    </div>
                    <div className="middle">Are you sure?</div>
                    <div className="bottom" onClick={() => { deletePrinter(); setpopUpWindow(false); }}>Delete</div>
                </div>
                : 
                <div className="editWindow">
                    {secondOption ? 
                    
                        <div className="editing">
                            {editOption == "model" || editOption == "lease" || editOption == "com" || editOption == "ip" ? 
                            <> New {editOption}: <input type="text" className="input" onChange={(data)=>{setTempData(data.target.value)}}/><div className="applyButton" onClick={()=>{setEditData(tempData)}}>Apply</div> </>
                            :""}
                            {editOption == "status" ? 
                                <div className="status"> New status: <br />
                                    <div className="optionContainer">
                                        <div onClick={()=>{
                                            setEditData("active")
                                        }}>active</div>
                                        <div onClick={()=>{
                                            setEditData("inactive")
                                        }}>inactive</div>
                                    </div>


                                </div>
                            : ""}
                            {editOption == "version" ? "Changing version is currently not supported :(":""}
                            {editOption == "oid" ? "Feature is under development. Please use API to do that":"" }
                            </div>
                    :
                        <div className="editOptions">
                            <div className="top">
                                <div className="option" onClick={()=>{handleOptions("model")}}>Model</div>
                                <div className="option" onClick={()=>{handleOptions("version")}}>Version</div>
                                <div className="option" onClick={()=>{handleOptions("lease")}}>Lease</div>
                            </div>
                            <div className="middle">
                                <div className="option" onClick={()=>{handleOptions("status")}}>Status</div>
                                <div className="option" onClick={()=>{handleOptions("com")}}>Com</div>
                                <div className="option" onClick={()=>{handleOptions("ip")}}>Ip</div>
                            </div>
                            <div className="bottom">
                                <div className="option" onClick={()=>{handleOptions("oid")}}>OID's</div>
                            </div>
                        </div>
                    }
                    
                   
                    <div className="cancelButton" onClick={()=>{setpopUpWindow(false)}}>Cancel</div>

                </div>
                }

        </div>
    );
}
