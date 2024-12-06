import { Nav, Navbar, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SLSNavbar(props) {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand as={Link} to="/">
        <img
          alt="League Logo"
          src={"https://sleepercdn.com/avatars/thumbs/" + props.league_avatar}
          width="50px"
          height="50px"
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
        />{" "}
        {props.league_name}
      </Navbar.Brand>
      <Nav variant="pills">
        <Nav.Link as={Link} to="/power_rankings" style={{ margin: "0.5rem" }}>
          Power Rankings
        </Nav.Link>
        <DropdownButton title="Teams" style={{ margin: "0.5rem" }}>
          {props.teams.map((team) => {
            return (
              <Dropdown.Item
                key={team.name}
                as={Link}
                to={`/teams/${team.name}`}
              >
                <img alt="Team Logo" src={team.avatar} width="20" height="20" />{" "}
                {team.name}
              </Dropdown.Item>
            );
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
