import { useState, useEffect } from "react";

function Hub(props) {
  const [leagueBasicData, setLeagueBasicData] = useState({});
  const [matchupsData, setMatchupsData] = useState({});
  const [teamsData, setTeamsData] = useState({});

  const prefix = "https://api.sleeper.app/v1/league/" + props.leagueID + "/";

  useEffect(() => {
    fetch(prefix)
      .then((b) => b.json())
      .then((basic) => {
        setLeagueBasicData(basic);
        const weeks = basic.settings.leg;
        const matchups = {};
        for (let i = 1; i <= weeks; i++) {
          fetch(prefix + "matchups/" + i)
            .then((m) => m.json())
            .then((matches) => {
              matchups[i] = matches;
            });
        }
        setMatchupsData(matchups);
      });
    fetch(prefix + "users")
      .then((u) => u.json())
      .then((u) => {
        const users = {};
        for (let i = 0; i < u.length; i++) {
          users[u[i].user_id] = u[i];
        }

        fetch(prefix + "rosters")
          .then((r) => r.json())
          .then((rosters) => {
            const teams = {};
            for (let i = 0; i < rosters.length; i++) {
              teams[rosters[i].roster_id] = {
                ...rosters[i],
                avatar: users[rosters[i].owner_id].avatar,
                name: users[rosters[i].owner_id].display_name,
              };
            }
            setTeamsData(teams);
          });
      });
  }, [prefix]);

  useEffect(() => console.log(matchupsData), [matchupsData]);
  useEffect(() => console.log(teamsData), [teamsData]);

  const onScreen = () => {
    if (
      JSON.stringify(leagueBasicData) === "{}" ||
      JSON.stringify(matchupsData) === "{}" ||
      JSON.stringify(teamsData) === "{}"
    ) {
      return (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      );
    }
    return (
      <div>
        <h1>{leagueBasicData.name}</h1>
        <img
          src={"https://sleepercdn.com/avatars/" + leagueBasicData.avatar}
          alt="League Icon"
        />
        <p>{leagueBasicData.season}</p>
        <p>Week {leagueBasicData.settings.leg}</p>
      </div>
    );
  };

  return onScreen();
}

export default Hub;
