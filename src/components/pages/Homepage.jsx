import TableOverflow from "../components/TableOverflow";

export default function Homepage(props) {
  return (
    <div style={{ flexDirection: "column", margin: "1rem" }}>
      <h1>Standings</h1>
      <TableOverflow
        headers={["Rank", "Team", "Record", "Points For", "Max Points For"]}
        data={props.standings.map((team, rank) => {
          return [
            rank + 1,
            <div>
              <img alt="Team Logo" src={team.avatar} width="20" height="20" />{" "}
              {team.name}
            </div>,
            <div>
              {team.wins}
              {"-"}
              {team.losses}
            </div>,
            team.points_for,
            team.max_points_for,
          ];
        })}
        min_width="1000px"
      />
    </div>
  );
}
