import { useState } from "react";

function Init(props) {
  const [leagueID, setLeagueID] = useState("");

  const verifyLeagueID = () => {
    if (leagueID.length > 0) {
      fetch("https://api.sleeper.app/v1/league/" + leagueID)
        .then((r) => r.json())
        .then((r) => {
          if (r == null) {
            console.log("invalid league ID");
          } else {
            props.advance(leagueID);
          }
        });
    }
  };

  return (
    <div className="Hub">
      <input
        id="league_id_input"
        name="league_id_input"
        value={leagueID}
        onChange={(e) => setLeagueID(e.target.value)}
        autoComplete="off"
      ></input>
      <button type="button" className="btn" onClick={verifyLeagueID}>
        Verify
      </button>
    </div>
  );
}

export default Init;
