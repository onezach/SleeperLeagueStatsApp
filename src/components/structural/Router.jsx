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
    teams: [],
    powerRankData: { data: [] },
  });

  const reset = () => {
    setData({
      league: {},
      matchups: {},
      teams: [],
      powerRankData: { data: [] },
    });
    sessionStorage.removeItem("league_id");
    sessionStorage.removeItem("league_data");
  };

  const start = (leagueData, matchups, teams, powerRankData) => {
    setData({
      league: leagueData,
      matchups: matchups,
      teams: teams,
      powerRankData: powerRankData,
    });
    sessionStorage.setItem("league_id", leagueData.league_id);
    sessionStorage.setItem(
      "league_data",
      JSON.stringify({
        league: leagueData,
        matchups: matchups,
        teams: teams,
        powerRankData: powerRankData,
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
          <Route
            index
            element={
              <Homepage
                standings={data.teams.sort((t1, t2) => {
                  if (t1.wins === t2.wins) {
                    return t2.points_for - t1.points_for;
                  } else {
                    return t2.wins - t1.wins;
                  }
                })}
                data={data.league}
              />
            }
          />
          <Route
            path="/power_rankings"
            element={<PowerRankings powerRankData={data.powerRankData} />}
          />
          {data.teams.map((team, tidx) => {
            return (
              <Route
                key={team.name}
                path={`/teams/${team.name}`}
                element={<Team data={data.teams[tidx]} idx={tidx} />}
              />
            );
          })}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
