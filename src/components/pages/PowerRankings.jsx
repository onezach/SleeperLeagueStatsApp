import { useContext } from "react";

import SLSContext from "../../context/SLSContext";

export default function PowerRankings() {
  const [data] = useContext(SLSContext);
  return <div>{JSON.stringify(data)}</div>;
}
