import "../styles/printers.scss"
import BrowsePrinters from "../components/BrowsePrinters"
import AddPrinters from "../components/AddPrinters"
import { useState, useEffect } from "react"

function Printers({apiUrl}) {
  const [reload, setReload] = useState(false)
  const [info, setInfo] = useState(false);

  const handleReload = () => {
    setReload(!reload);
  }
  
  useEffect(() => {
    if (info != "false") {
        const timer = setTimeout(() => {
            setInfo(false); 
        }, 3000);
        return () => clearTimeout(timer);
    }
}, [info]);

  return (
    <div className="printers">

        <div className={`alertBox ${info ? "showAlertBox":""}`}>
            {info === "added" && <p>Printer added successfully</p>}
            {info === "deleted" && <p>Printer deleted successfully</p>}
            {info === "updated" && <p>Printer updated successfully</p>}
          </div>
        <BrowsePrinters apiUrl={apiUrl} setInfo={setInfo} handleReload={handleReload} reload={reload} />
        <AddPrinters apiUrl={apiUrl} setInfo={setInfo} handleReload={handleReload} reload={reload} />
    </div>
  )
}

export default Printers
