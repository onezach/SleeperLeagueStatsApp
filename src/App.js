import "./App.scss";

import Init from "./components/init";
import Hub from "./components/hub";

import { useState } from "react";

function App() {
  const [leagueID, setLeagueID] = useState("");
  const [status, setStatus] = useState("init");

  const advance = (id) => {
    setLeagueID(id);
    setStatus("active");
  }

  if (status === "init") {
    return <Init advance={advance}/>;
  } else {
    return <Hub leagueID={leagueID} />
  }
}

export default App;
