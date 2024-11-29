import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import SLS from "./SLS";
import Homepage from "../pages/Homepage";
import PowerRankings from "../pages/PowerRankings";
import NoMatch from "../pages/NoMatch";
import Team from "../pages/Team";

export default function Router() {
  const [data, setData] = useState({ league: {}, matchups: {}, teams: {} });
  const [dataInitialized, setDataInitialized] = useState(false);

  const reset = () => {
    setData({ league: {}, matchups: {}, teams: {} });
    setDataInitialized(false);
  };

  const start = (leagueData, matchups, teams) => {
    setData({ league: leagueData, matchups: matchups, teams: teams });
    setDataInitialized(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SLS
              dataInitialized={dataInitialized}
              data={data}
              reset={reset}
              start={start}
            />
          }
        >
          <Route index element={<Homepage data={data} />} />
          <Route
            path="/power_rankings"
            element={<PowerRankings data={data} />}
          />
          {dataInitialized && data.league.team_list.map((team) => {
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
