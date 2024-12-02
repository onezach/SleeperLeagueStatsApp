import { Container, Row, Col } from "react-bootstrap";

export default function Homepage(props) {
  return (
    <Container>
      <h1>Overview</h1>
      <Row style={{ margin: "0.2rem" }}>
        <Col xs={1}>
          <b>Rank</b>
        </Col>
        <Col xs={3}>
          <b>Team</b>
        </Col>
        <Col xs={1}>
          <b>Record</b>
        </Col>
        <Col xs={2}>
          <b>Points For</b>
        </Col>
        <Col xs={2}>
          <b>Max Points For</b>
        </Col>
      </Row>
      {props.standings.map((team, rank) => (
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
    </Container>
  );
}
