import { useContext } from "react";

import SLSContext from "../context/SLSContext";

export default function Homepage() {
  const [data] = useContext(SLSContext);

  const buildContent = () => {
    return (
      <div>
        <h1>
          {data.league.name}
          {" ("}
          {data.league.season}
          {")"}
        </h1>
        <img
          src={"https://sleepercdn.com/avatars/" + data.league.avatar}
          alt="League Icon"
          style={{ width: "25vw" }}
        />
      </div>
    );
  };

  return <div className="Hub">{buildContent()}</div>;
}
