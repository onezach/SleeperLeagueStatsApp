import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Form, Button, Alert, Container, Stack } from "react-bootstrap";

import SLSNavbar from "./SLSNavbar";

export default function SLS(props) {
  const [loading, setLoading] = useState(false);

  const LIDref = useRef();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");

  const calculateFourWeekAverage = (weekly_points) => {
    let total = 0;
    const num_weeks = weekly_points.length >= 4 ? 4 : weekly_points.length;
    for (
      let i = weekly_points.length - 1;
      i > weekly_points.length - num_weeks - 1;
      i--
    ) {
      total += weekly_points[i];
    }
    return (total / 4).toFixed(2);
  };

  const powerRankData = (league, matchups, teams) => {
    const rank_week = league.settings.last_scored_leg;
    let team_weekly_points = [];
    for (let i = 1; i <= rank_week; i++) {
      for (let j = 0; j < league.total_rosters; j++) {
        const points = matchups[i][j].points;
        if (i === 1) {
          team_weekly_points.push([]);
        }
        team_weekly_points[j].push(points);
      }
    }

    let all_avgs = [];
    let all_mpfs = [];

    const raw_data = team_weekly_points.map((team, tidx) => {
      const four_week_avg = calculateFourWeekAverage(team);
      all_avgs.push(four_week_avg);

      const max_points_for = teams[tidx].max_points_for;
      all_mpfs.push(max_points_for);
      return {
        ...teams[tidx],
        four_week_avg: four_week_avg,
      };
    });

    // X_norm = (X - X.min()) / (X.max() - X.min())
    const min_avg = Math.min.apply(Math, all_avgs);
    const max_avg = Math.max.apply(Math, all_avgs);
    const avg_diff = max_avg - min_avg;
    const min_mpf = Math.min.apply(Math, all_mpfs);
    const max_mpf = Math.max.apply(Math, all_mpfs);
    const mpf_diff = max_mpf - min_mpf;

    return {
      data: raw_data,
      min_avg: min_avg,
      avg_diff: avg_diff,
      min_mpf: min_mpf,
      mpf_diff: mpf_diff,
      rank_week: rank_week,
    };
  };

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

    const numTeams = leagueData.total_rosters;

    for (let i = 0; i < numTeams; i++) {
      usersByID[users[i].user_id] = users[i];
    }

    const r4 = await fetch(prefix + "rosters");
    const rosters = await r4.json();
    const teams = [];

    for (let i = 0; i < numTeams; i++) {
      const name = usersByID[rosters[i].owner_id].metadata.team_name
        ? usersByID[rosters[i].owner_id].metadata.team_name
        : usersByID[rosters[i].owner_id].display_name;
      const points_for =
        rosters[i].settings.fpts + rosters[i].settings.fpts_decimal / 100;
      const max_points_for =
        rosters[i].settings.ppts + rosters[i].settings.ppts_decimal / 100;
      teams.push({
        avatar: usersByID[rosters[i].owner_id].metadata.avatar
          ? usersByID[rosters[i].owner_id].metadata.avatar
          : "https://sleepercdn.com/avatars/thumbs/" +
            usersByID[rosters[i].owner_id].avatar,
        name: name,
        points_for: points_for,
        max_points_for: max_points_for,
        wins: rosters[i].settings.wins,
        losses: rosters[i].settings.losses,
        efficiency: points_for / max_points_for,
        win_pct: (
          rosters[i].settings.wins / leagueData.settings.last_scored_leg
        ),
      });
    }

    setLoading(false);
    setAlertMessage("");
    setAlertVariant("danger");
    props.start(
      leagueData,
      matchups,
      teams,
      powerRankData(leagueData, matchups, teams)
    );
  };

  return (
    <>
      {sessionStorage.getItem("league_id") ? (
        <div>
          <SLSNavbar
            reset={props.reset}
            teams={props.data.teams}
            league_name={props.data.league.name}
            league_avatar={props.data.league.avatar}
          />
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
