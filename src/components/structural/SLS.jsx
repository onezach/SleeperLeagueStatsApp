import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Form, Button, Alert, Container, Row } from "react-bootstrap";

import SLSNavbar from "./SLSNavbar";
import SLSContext from "../../context/SLSContext";

export default function SLS() {
  const [data, setData] = useState({ league: {}, matchups: {}, teams: {} });
  const [dataInitialized, setDataInitialized] = useState(false);

  const [loading, setLoading] = useState(false);

  const LIDref = useRef();

  const reset = () => {
    setData({ league: {}, matchups: {}, teams: {} });
    setDataInitialized(false);
  };

  const handleConnect = async () => {
    const LID = LIDref.current.value;

    const r1 = await fetch("https://api.sleeper.app/v1/league/" + LID);
    if (r1.status === 404) {
      console.log("invalid");
      return;
    }

    setLoading(true);
    const leagueData = await r1.json();
    const prefix = "https://api.sleeper.app/v1/league/" + LID + "/";
    const weeks = leagueData.settings.leg;
    const matchups = {};

    for (let i = 1; i <= weeks; i++) {
      const r2 = await fetch(prefix + "matchups/" + i);
      const thisWeekMatches = await r2.json();
      matchups[i] = thisWeekMatches;
    }

    const r3 = await fetch(prefix + "users");
    const users = await r3.json();
    const usersByID = {};

    for (let i = 0; i < users.length; i++) {
      usersByID[users[i].user_id] = users[i];
    }

    const r4 = await fetch(prefix + "rosters");
    const rosters = await r4.json();
    const teams = {};

    for (let i = 0; i < rosters.length; i++) {
      teams[rosters[i].roster_id] = {
        ...rosters[i],
        avatar: usersByID[rosters[i].owner_id].avatar,
        name: usersByID[rosters[i].owner_id].display_name,
      };
    }
    setLoading(false);
    setData({ league: leagueData, matchups: matchups, teams: teams });
    setDataInitialized(true);
  };

  return (
    <>
      {dataInitialized ? (
        <SLSContext.Provider value={[data, reset]}>
          <SLSNavbar />
          <Outlet />
        </SLSContext.Provider>
      ) : (
        <div style={{ margin: "1rem" }}>
          <Container>
            <h1>Sleeper League Stats</h1>

            <Form>
              <Form.Control
                type="text"
                ref={LIDref}
                placeholder="Enter your Sleeper League ID"
              />
            </Form>

            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div style={{ marginRight: "0.5rem" }}>
                <Button variant="primary" onClick={handleConnect}>
                  Login
                </Button>
              </div>
              {loading && <div className="spinner-border" role="status" />}
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
