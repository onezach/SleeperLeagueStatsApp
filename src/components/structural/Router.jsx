import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import SLS from "./SLS";
import Homepage from "../pages/Homepage";
import PowerRankings from "../pages/PowerRankings";
import NoMatch from "../pages/NoMatch";
import Team from "../pages/Team";

export default function Router() {
  const [data, setData] = useState({
    league: {},
    matchups: {},
    teams: {},
    powerRankData: { data: [] },
    team_list: [],
  });

  const reset = () => {
    setData({
      league: {},
      matchups: {},
      teams: {},
      powerRankData: { data: [] },
      team_list: [],
    });
    sessionStorage.removeItem("league_id");
    sessionStorage.removeItem("league_data");
  };

  const start = (leagueData, matchups, teams, powerRankData, team_list) => {
    setData({
      league: leagueData,
      matchups: matchups,
      teams: teams,
      powerRankData: powerRankData,
      team_list: team_list,
    });
    sessionStorage.setItem("league_id", leagueData.league_id);
    sessionStorage.setItem(
      "league_data",
      JSON.stringify({
        league: leagueData,
        matchups: matchups,
        teams: teams,
        powerRankData: powerRankData,
        team_list: team_list,
      })
    );
  };

  useEffect(() => {
    if (sessionStorage.getItem("league_id")) {
      setData(JSON.parse(sessionStorage.getItem("league_data")));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<SLS data={data} reset={reset} start={start} />}
        >
          <Route index element={<Homepage />} />
          <Route
            path="/power_rankings"
            element={<PowerRankings powerRankData={data.powerRankData} />}
          />
          {data.team_list.map((team) => {
            return (
              <Route
                key={team}
                path={`/teams/${team}`}
                element={<Team name={team} />}
              />
            );
          })}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
