import { useContext, useState, useEffect } from "react";

import { Container, Row, Col } from "react-bootstrap";

import SLSContext from "../../context/SLSContext";

export default function Homepage() {
  const [data] = useContext(SLSContext);

  const [standings, setStandings] = useState([]);

  const rankTeams = (t1, t2) => {
    if (t1.wins === t2.wins) {
      return t2.points_for - t1.points_for;
    } else {
      return t2.wins - t1.wins;
    }
  };

  useEffect(() => {
    let teams = [];
    for (let i = 1; i <= data.league.total_rosters; i++) {
      const avatar = data.teams[i].custom_avatar
        ? data.teams[i].avatar
        : "https://sleepercdn.com/avatars/thumbs/" + data.teams[i].avatar;

      teams.push({
        name: data.teams[i].name,
        avatar: avatar,
        wins: data.teams[i].settings.wins,
        losses: data.teams[i].settings.losses,
        points_for:
          data.teams[i].settings.fpts +
          data.teams[i].settings.fpts_decimal / 100,
        max_points_for:
          data.teams[i].settings.ppts +
          data.teams[i].settings.ppts_decimal / 100,
      });
    }
    teams.sort(rankTeams);
    setStandings(teams);
  }, [data.league.total_rosters, data.teams])

  return (
    <Container>
      <h1>Overview</h1>
      <Row style={{ margin: "0.2rem" }}>
        <Col xs={1}><b>Rank</b></Col>
        <Col xs={3}><b>Team</b></Col>
        <Col xs={1}><b>Record</b></Col>
        <Col xs={2}><b>Points For</b></Col>
        <Col xs={2}><b>Max Points For</b></Col>
      </Row>
      {standings.map((team, rank) => (
        <Row key={team.name} style={{ margin: "0.2rem" }}>
          <Col xs={1}>{rank + 1}</Col>
          <Col xs={3}>
            <img alt="Team Logo" src={team.avatar} width="20" height="20" />{" "}
            {team.name}
          </Col>
          <Col xs={1}>
            {team.wins}
            {"-"}
            {team.losses}
          </Col>
          <Col xs={2}>{team.points_for}</Col>
          <Col xs={2}>{team.max_points_for}</Col>
        </Row>
      ))}
      {/* <Row>{JSON.stringify(data.teams)}</Row> */}
    </Container>
  );
}
