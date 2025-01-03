import { useState, useEffect } from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import FormRange from "react-bootstrap/esm/FormRange";

import TableOverflow from "../components/TableOverflow";

export default function PowerRankings(props) {
  const [powerRanks, setPowerRanks] = useState([]);
  const [powerRankSliders, setPowerRankSliders] = useState({
    four_week_avg: 9,
    max_points_for: 9,
    win_pct: 6,
    efficiency: 7,
  });

  const { powerRankData } = props;

  useEffect(() => {
    const power_ranks = powerRankData.data
      .map((team) => {
        const four_week_average_norm =
          (team.four_week_avg - powerRankData.min_avg) / powerRankData.avg_diff;
        const max_points_for_norm =
          (team.max_points_for - powerRankData.min_mpf) /
          powerRankData.mpf_diff;
        return {
          name: team.name,
          score: (
            four_week_average_norm * powerRankSliders.four_week_avg +
            max_points_for_norm * powerRankSliders.max_points_for +
            team.win_pct * powerRankSliders.win_pct +
            team.efficiency * powerRankSliders.efficiency
          ).toFixed(2),
        };
      })
      .sort((t1, t2) => t2.score - t1.score);

    setPowerRanks(power_ranks);
  }, [powerRankSliders, powerRankData]);

  const handleSliderUpdate = (metric, value) => {
    switch (metric) {
      case "four_week_avg":
        setPowerRankSliders((prev) => ({ ...prev, four_week_avg: value }));
        break;
      case "max_points_for":
        setPowerRankSliders((prev) => ({ ...prev, max_points_for: value }));
        break;
      case "win_pct":
        setPowerRankSliders((prev) => ({ ...prev, win_pct: value }));
        break;
      case "efficiency":
        setPowerRankSliders((prev) => ({ ...prev, efficiency: value }));
        break;
      default:
        break;
    }
  };

  const buildVisualization = () => {
    const total =
      parseInt(powerRankSliders.four_week_avg) +
      parseInt(powerRankSliders.max_points_for) +
      parseInt(powerRankSliders.win_pct) +
      parseInt(powerRankSliders.efficiency);
    return powerRanks.map((team, tidx) => {
      const scoreAsADecimal = team.score / total;
      return (
        <div
          key={"team_" + tidx}
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "0.25rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ margin: "0.25rem", width: "2rem" }}>#{tidx + 1}</div>
          <div style={{ margin: "0.25rem" }}>{team.name}</div>
          <div
            style={{
              width: `${scoreAsADecimal * 100}%`,
              backgroundColor: `#${Math.floor(
                256 * (1 - scoreAsADecimal)
              ).toString(16)}ff00`,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              zIndex: -1,
            }}
          />
        </div>
      );
    });
  };

  return (
    <Container>
      <div>
        <h1>Power Rankings {"(Week " + powerRankData.rank_week + ")"}</h1>
        <p>
          Adjust the sliders according to your weight preferences for different
          criteria.
        </p>
      </div>

      <Form>
        <Form.Group as={Row}>
          <Col xs={6} lg={3}>
            <div>
              {"Four-Week Average (" + powerRankSliders.four_week_avg + ")"}
            </div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.four_week_avg}
              onChange={(e) =>
                handleSliderUpdate("four_week_avg", e.target.value)
              }
            />
          </Col>
          <Col xs={6} lg={3}>
            <div>
              {"Max Points-For (" + powerRankSliders.max_points_for + ")"}
            </div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.max_points_for}
              onChange={(e) =>
                handleSliderUpdate("max_points_for", e.target.value)
              }
            />
          </Col>
          <Col xs={6} lg={3}>
            <div>{"Win Percentage: (" + powerRankSliders.win_pct + ")"}</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.win_pct}
              onChange={(e) => handleSliderUpdate("win_pct", e.target.value)}
            />
          </Col>
          <Col xs={6} lg={3}>
            <div>{"Efficiency (" + powerRankSliders.efficiency + ")"}</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.efficiency}
              onChange={(e) => handleSliderUpdate("efficiency", e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
      <div>
        <p>
          <b>Four-Week Average:</b> Average points scored over the last 4 weeks
        </p>
        <p>
          <b>Max Points-For:</b> The total points a team would have scored had
          they started their optimal lineup every week
        </p>
        <p>
          <b>Efficiency:</b> The team's points-for divided by their max
          points-for across the season
        </p>
      </div>
      <div>
        <h2>Rankings</h2>
        {buildVisualization()}
      </div>
      <h2>Data</h2>
      <TableOverflow
        headers={[
          "Team",
          "Four Week Average",
          "Max Points For",
          "Record",
          "Efficiency",
        ]}
        data={powerRankData.data.map((team) => {
          return [
            team.name,
            team.four_week_avg,
            team.max_points_for,
            <div>
              {team.wins +
                "-" +
                team.losses +
                " (" +
                (100 * team.win_pct).toFixed(0) +
                "%)"}
            </div>,
            <div>{(100 * team.efficiency).toFixed(2) + "%"}</div>,
          ];
        })}
        min_width="1000px"
      />
    </Container>
  );
}
