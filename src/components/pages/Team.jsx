import { Container, Row, Col } from "react-bootstrap";

export default function Team(props) {
  return (
    <Container>
        <Row></Row>
      <h1>{props.name}</h1>
    </Container>
  );
}
