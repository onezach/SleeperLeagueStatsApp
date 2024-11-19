import { BrowserRouter, Route, Routes } from "react-router-dom";

import SLS from "./SLS";
import Homepage from "../pages/Homepage";
import PowerRankings from "../pages/PowerRankings";
import NoMatch from "../pages/NoMatch";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SLS />}>
          <Route index element={<Homepage />} />
          <Route path="/power_rankings" element={<PowerRankings />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
