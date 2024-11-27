import { Nav, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SLSNavbar(props) {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand style={{ margin: "0.5rem" }} as={Link} to="/">
        <img
          alt="League Logo"
          src={
            "https://sleepercdn.com/avatars/thumbs/" + props.data.league.avatar
          }
          width="30"
          height="30"
        />{" "}
        {props.data.league.name}
      </Navbar.Brand>
      <Nav variant="pills">
        <Nav.Link as={Link} to="/power_rankings">
          Power Rankings
        </Nav.Link>
      </Nav>
      <Navbar.Collapse
        className="justify-content-end"
        style={{ margin: "0.5rem" }}
      >
        <Button type="reset" onClick={props.reset}>
          Reset
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}
