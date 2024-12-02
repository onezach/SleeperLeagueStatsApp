export default function Homepage(props) {
  return (
    <div style={{ flexDirection: "column", margin: "1rem" }}>
      <h1>Standings</h1>
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <table style={{ minWidth: "1000px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Record</th>
              <th>Points For</th>
              <th>Max Points For</th>
            </tr>
          </thead>
          <tbody>
            {props.standings.map((team, rank) => (
              <tr key={team.name}>
                <td>{rank + 1}</td>
                <td>
                  <img
                    alt="Team Logo"
                    src={team.avatar}
                    width="20"
                    height="20"
                  />{" "}
                  {team.name}
                </td>
                <td>
                  {team.wins}
                  {"-"}
                  {team.losses}
                </td>
                <td>{team.points_for}</td>
                <td>{team.max_points_for}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
