import { BrowserRouter, Route, Routes } from "react-router-dom";

import SLS from "./SLS";
import Homepage from "../Homepage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SLS />}>
          <Route index element={<Homepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
