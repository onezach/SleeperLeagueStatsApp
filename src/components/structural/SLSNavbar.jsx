import { Container, Nav, Navbar, Row, Col, Button } from "react-bootstrap";
import { useContext } from "react";
import { Link } from "react-router-dom";

import SLSContext from "../../context/SLSContext";

export default function SLSNavbar() {
  const [data, reset] = useContext(SLSContext);

  return (
    <Navbar bg="dark" variant="dark" className="justify-content-between">
      <Nav style={{ margin: "0.5rem" }}>
        <Navbar.Brand as={Link} to="/">
          <img
            alt="League Logo"
            src={"https://sleepercdn.com/avatars/" + data.league.avatar}
            width="30"
            height="30"
          />{" "}
          {data.league.name}
        </Navbar.Brand>
      </Nav>
      <Nav style={{ margin: "0.5rem" }}>
        <Button type="reset" onClick={reset}>
          Reset
        </Button>
      </Nav>
    </Navbar>
  );
}
