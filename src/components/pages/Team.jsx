import { Container, Row, Col, Card } from "react-bootstrap";

export default function Team(props) {
  return (
    <Container>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Img variant="top" src={props.data.avatar} />
              <Card.Title>{props.data.name}</Card.Title>
              {/* <Card.Text>
                {props.data.points_for}
                {"/"}
                {props.data.max_points_for}
              </Card.Text> */}
            </Card.Body>
          </Card>
        </Col>
        {/* <Col xs={12} md={6} lg={4}>
        
        </Col> */}
      </Row>
    </Container>
  );
}
