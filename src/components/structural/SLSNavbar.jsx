import { Container, Nav, Navbar, Row, Col, Button } from "react-bootstrap";
import { useContext } from "react";
import { Link } from "react-router-dom";

import SLSContext from "../../context/SLSContext";

export default function SLSNavbar() {
  const [, reset] = useContext(SLSContext);

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>Sleeper League Stats</Navbar.Brand>
        <Navbar.Collapse>
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Button type="reset" onClick={reset}>
              Reset
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
