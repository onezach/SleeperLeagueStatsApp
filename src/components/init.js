import { useState } from "react";

function Init(props) {
  const [leagueID, setLeagueID] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const verifyLeagueID = () => {
    if (leagueID.length > 0) {
      fetch("https://api.sleeper.app/v1/league/" + leagueID)
        .then((r) => r.json())
        .then((r) => {
          if (r == null) {
            setShowErrorMessage(true);
            console.log("invalid league ID");
          } else {
            setShowErrorMessage(false);
            props.advance(leagueID);
          }
        });
    } else {
      setShowErrorMessage(true);
    }
  };

  return (
    <div className="Init-container">
        <div className="Init">
      <div className="Init-title">
        <h1>Sleeper League ID</h1>
      </div>
      <div className="Init-input-container">
        <input
          id="league_id_input"
          name="league_id_input"
          value={leagueID}
          onChange={(e) => setLeagueID(e.target.value)}
          autoComplete="off"
        />{" "}
      </div>
      {showErrorMessage && (
        <div className="Init-error">
          Invalid League ID
        </div>
      )}
      <div className="Init-button">
        <button
          type="button"
          className="btn btn-primary "
          onClick={verifyLeagueID}
        >
          Connect
        </button>
      </div>
      </div>
    </div>
  );
}

export default Init;
