import { useEffect, useState } from "react"
import "../styles/printers.scss"


function AddPrinters({apiUrl, setInfo, handleReload, reload}) {
  const [autoID, setAutoID] = useState("")
  const [printerData, setPrinterData] = useState({
    _id: '',
    model: '',
    lease: '',
    status: 'active',
    version: '2c',
    ip: '',
    com: '',
    oid: {
      name: '',
      pages_total: '',
      location: '',
      mono_pages: '',
      serial_no: '',
      color_pages: '',
      full_model: ''
    }
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrinterData({
      ...printerData,
      [name]: value
    });
  };

  const handleOidsChange = (e) => {
    const { name, value } = e.target;
    setPrinterData({
      ...printerData,
      oid: {
        ...printerData.oid,
        [name]: value
      }
    });
  };

  const handleSwitchChange = () => {
    setPrinterData({
      ...printerData,
      status: printerData.status == "active" ? "inactive":"active"
    });
  };

  const handleVersionChange = (version) => {
    setPrinterData({
      ...printerData,
      version
    });
  };

  function extractNumberFromString(str) {
    const match = str.match(/_(\d+)$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  }


  async function printersAutoId(){
     
        const response = await fetch(apiUrl+'printers/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        const ids = result.map(printer => printer._id);
        var biggestNumber = 0;
        for(let i=0; i<ids.length; i++){
          let result = extractNumberFromString(ids[i])
          if(result>biggestNumber) biggestNumber = result
        }
        setAutoID(`printer_${biggestNumber+1}`)
        return `printer_${biggestNumber+1}`
    }
 

 
  async function addPrinter(){
    if(printerData.model === "" || printerData.ip === "" || printerData.com === "" || printerData.oid.name === "" || printerData.oid.pages_total === "" || printerData.oid.location === "" || printerData.oid.serial_no === "" || printerData.oid.full_model === ""){
      alert("Please fill the required fields");
      return -1;
    }

    let updatedPrinterData = {...printerData};
    updatedPrinterData = {
      ...updatedPrinterData,
      model: printerData.model.toUpperCase(),
    };
    if(printerData._id == ""){
      var autoID = await printersAutoId();
       updatedPrinterData = {
         ...updatedPrinterData,
         _id: autoID
       };
     }
     if(printerData.lease == ""){
      printerData.lease = "--"
     }

      // Remove mono_pages and color_pages if they are empty
      if (printerData.oid.mono_pages === "") {
        delete updatedPrinterData.oid.mono_pages;
      }

      if (printerData.oid.color_pages === "") {
        delete updatedPrinterData.oid.color_pages;
      }

     await sendData(JSON.stringify(updatedPrinterData))
     handleReload();
     setInfo("added")
  }
  async function sendData(data){
    const response = await fetch(apiUrl+'printers/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
      mode: 'cors'
     });

    console.log(data, response);
    
  }
  useEffect(()=>{
    printersAutoId()
  })
  useEffect(()=>{
    printersAutoId()
  },[reload])
  return (
    <div className="addPrinters">
      <h2> ADD PRINTER</h2>
      <div className="autoAddPrinter">
        <div className="section">
          <div>ID: <br /><input name="id" placeholder={`AUTO: ${autoID}`} onChange={handleInputChange}></input></div>
          <div>*Model: <br /><input name="model" className="modelInput" placeholder="KYOCERA" onChange={handleInputChange}></input></div>
        </div>
        <div className="section">
          <div>Lease: <br /><input name="lease" className="lease" placeholder="DEFAULT: --" onChange={handleInputChange}></input></div>
          <div className="selectOptions">
            <div className="isActive">
              Active:<br />
              <div className={`switch ${printerData.status == 'active' ? 'active' : 'inactive'}`} onClick={handleSwitchChange}>
                <div className="switch-handle">{printerData.status == 'inactive' ? "inactive" : "active"}</div>
              </div>
            </div>
            <div className="version">SNMPv <br />
              <div className="versionChoose">
                <div className={printerData.version === "2c" ? "activeVersion" : ""} onClick={() => handleVersionChange("2c")}>2c</div>
                <div className={printerData.version === "2" ? "activeVersion" : ""} onClick={() => handleVersionChange("2")}>2</div>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div>*Ip: <br /><input name="ip" placeholder="10.0.0.1" onChange={handleInputChange}></input></div>
          <div>*Com: <br /><input name="com" placeholder="community string" onChange={handleInputChange}></input></div>
        </div>
        <div className="oidsSection">
          OIDS: <br />
          <div className="gridContainer">
            <input type="text" name="name" className="gridItem" placeholder="name*" onChange={handleOidsChange}></input>
            <input type="text" name="pages_total" className="gridItem" placeholder="pages_total*" onChange={handleOidsChange}></input>
            <input type="text" name="location" className="gridItem" placeholder="location*" onChange={handleOidsChange}></input>
            <input type="text" name="mono_pages" className="gridItem" placeholder="mono_pages" onChange={handleOidsChange}></input>
            <input type="text" name="serial_no" className="gridItem" placeholder="serial_no*" onChange={handleOidsChange}></input>
            <input type="text" name="color_pages" className="gridItem" placeholder="color_pages" onChange={handleOidsChange}></input>
            <input type="text" name="full_model" className="gridItem" placeholder="full_model*" onChange={handleOidsChange}></input>
            <div className="button" onClick={addPrinter}><p>ADD PRINTER</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPrinters
