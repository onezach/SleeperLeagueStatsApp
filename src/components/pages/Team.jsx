import { Container, Row, Col, Card } from "react-bootstrap";

export default function Team(props) {
  //#d9ead3 (green)
  //#f4cccc (red)
  return (
    <Container>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Img variant="top" src={props.data.avatar} />
              <Card.Title>{props.data.name}</Card.Title>
              <Card.Text>
                {props.data.wins}-{props.data.losses}, {`(#${props.idx + 1} overall)`}
                
              </Card.Text>
              <Card.Text>
              {props.data.points_for} points {"(" + props.data.max_points_for + " max, " + (props.data.efficiency * 100).toFixed(2) + "% efficiency)"}
              </Card.Text>
              <Card.Text>
                {(props.data.points_for / props.data.last_scored_week).toFixed(2)} points per week
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              {props.data.matchups.map((week, widx) => {
                const status = widx < props.data.last_scored_week;
                const result = status
                  ? week.points_for > week.points_against
                    ? "W"
                    : "L"
                  : "-";

                return (
                  <Card.Text
                    style={{
                      backgroundColor: status
                        ? result === "W"
                          ? "#d9ead3"
                          : "#f4cccc"
                        : "#eeeeee",
                    }}
                  >
                    Week {widx + 1} vs. {week.opponent}: <b>{result},{" "}
                    {week.points_for}-{week.points_against}</b>
                  </Card.Text>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {/* {props.data.matchups.map((week, idx) => {
          return (
            <div>
              Week {idx + 1}: {props.data.name} vs. {week.opponent}...
              {week.points_for}-{week.points_against}
            </div>
          );
        })} */}
      </Row>
    </Container>
  );
}
