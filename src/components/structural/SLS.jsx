import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Form, Button, Alert, Container, Stack } from "react-bootstrap";

import SLSNavbar from "./SLSNavbar";

export default function SLS(props) {
  const [loading, setLoading] = useState(false);

  const LIDref = useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");

  const handleConnect = async () => {
    const LID = LIDref.current.value;

    if (LID.length === 0) {
      setAlertMessage("Invalid League ID");
      return;
    }

    const r1 = await fetch("https://api.sleeper.app/v1/league/" + LID);
    if (r1.status === 404) {
      setAlertMessage("Invalid League ID");
      return;
    }

    const leagueData = await r1.json();

    if (leagueData.sport !== "nfl") {
      setAlertMessage(
        "Sorry! This application is only compatible with NFL fantasy football leagues."
      );
      return;
    }

    setAlertVariant("success");
    setAlertMessage("Connecting to " + leagueData.name + "...");
    setLoading(true);
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

    for (let i = 0; i < leagueData.total_rosters; i++) {
      usersByID[users[i].user_id] = users[i];
    }

    const r4 = await fetch(prefix + "rosters");
    const rosters = await r4.json();
    const teams = {};
    let team_list = [];

    for (let i = 0; i < leagueData.total_rosters; i++) {
      const name = usersByID[rosters[i].owner_id].metadata.team_name ? usersByID[rosters[i].owner_id].metadata.team_name : usersByID[rosters[i].owner_id].display_name;
      team_list.push(name);
      teams[rosters[i].roster_id] = {
        ...rosters[i],
        avatar: usersByID[rosters[i].owner_id].metadata.avatar
          ? usersByID[rosters[i].owner_id].metadata.avatar
          : usersByID[rosters[i].owner_id].avatar,
        custom_avatar: usersByID[rosters[i].owner_id].metadata.avatar
          ? true
          : false,
        name: name,
      };
    }

    leagueData["team_list"] = team_list;

    setLoading(false);
    setAlertMessage("");
    setAlertVariant("danger");
    props.start(leagueData, matchups, teams);
  };

  return (
    <>
      {props.dataInitialized ? (
        <div>
          <SLSNavbar reset={props.reset} data={props.data} />
          <Outlet />
        </div>
      ) : (
        <div style={{ margin: "1rem" }}>
          <Container>
            <Stack gap={3}>
              <h1>Sleeper Fantasy Football League Stats</h1>

              <Form>
                <Form.Control
                  type="text"
                  ref={LIDref}
                  placeholder="Enter your Sleeper League ID"
                />
              </Form>

              {alertMessage && (
                <Alert variant={alertVariant}>{alertMessage}</Alert>
              )}

              <Stack direction="horizontal" gap={3}>
                <Button variant="primary" onClick={handleConnect}>
                  Login
                </Button>
                {loading && <div className="spinner-border" role="status" />}
              </Stack>
            </Stack>
          </Container>
        </div>
      )}
    </>
  );
}
