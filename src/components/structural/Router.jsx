import { BrowserRouter, Route, Routes } from "react-router-dom";

import SLS from "./SLS";
import Homepage from "../pages/Homepage";
import H2H from "../pages/Head2Head";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SLS />}>
          <Route index element={<Homepage />} />
          <Route path="/head2head" element={<H2H />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
