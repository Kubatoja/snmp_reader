import "./App.css";
import Sidepanel from "./components/Sidepanel";
import Printers from "./pages/Printers";
import Data from "./pages/Data";
import Scheduler from "./pages/Scheduler";
import { useState } from "react";

function App() {
  const [page, setPage] = useState("printers");

  const apiUrl = import.meta.env.VITE_API_BASE;

  return (
    <>
      <Sidepanel page={page} setPage={setPage} />
      {page == "printers" && <Printers apiUrl={apiUrl} />}
      {page == "data" && <Data apiUrl={apiUrl} />}
      {page == "scheduler" && <Scheduler apiUrl={apiUrl} />}
    </>
  );
}

export default App;
