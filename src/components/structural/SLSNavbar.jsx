import { Nav, Navbar, Button, Dropdown, DropdownButton } from "react-bootstrap";
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
        <Nav.Link as={Link} to="/power_rankings"  style={{ margin: "0.5rem" }}>
          Power Rankings
        </Nav.Link>
        <DropdownButton title="Teams"  style={{ margin: "0.5rem" }}>
          {props.data.league.team_list.map((team) => {
            return <Dropdown.Item key={team} as={Link} to={`/teams/${team}`}>{team}</Dropdown.Item>
          })}
        </DropdownButton>
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
