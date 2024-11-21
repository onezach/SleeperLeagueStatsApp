import { useContext, useState, useEffect } from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import FormRange from "react-bootstrap/esm/FormRange";

import SLSContext from "../../context/SLSContext";

export default function PowerRankings() {
  const [data] = useContext(SLSContext);

  const [powerRanks, setPowerRanks] = useState([]);
  const [powerRankSliders, setPowerRankSliders] = useState({
    four_week_avg: 9,
    max_points_for: 9,
    win_pct: 6,
    efficiency: 7,
  });
  const [powerRankData, setPowerRankData] = useState({ data: [] });

  const calculateFourWeekAverage = (weekly_points) => {
    let total = 0;
    const num_weeks = weekly_points.length >= 4 ? 4 : weekly_points.length;
    for (
      let i = weekly_points.length - 1;
      i > weekly_points.length - num_weeks - 1;
      i--
    ) {
      total += weekly_points[i];
    }
    return (total / 4).toFixed(2);
  };

  useEffect(() => {
    let team_weekly_points = [];
    for (let i = 1; i <= data.league.settings.last_scored_leg; i++) {
      for (let j = 0; j < data.league.total_rosters; j++) {
        const points = data.matchups[i][j].points;
        if (i === 1) {
          team_weekly_points.push([]);
        }
        team_weekly_points[j].push(points);
      }
    }

    let all_avgs = [];
    let all_mpfs = [];

    const raw_data = team_weekly_points.map((team, tidx) => {
      const four_week_avg = calculateFourWeekAverage(team);
      all_avgs.push(four_week_avg);

      const max_points_for =
        data.teams[tidx + 1].settings.ppts +
        data.teams[tidx + 1].settings.ppts_decimal / 100;
      all_mpfs.push(max_points_for);
      return {
        name: data.teams[tidx + 1].name,
        four_week_avg: four_week_avg,
        win_pct: (
          data.teams[tidx + 1].settings.wins /
          data.league.settings.last_scored_leg
        ).toFixed(2),
        max_points_for: max_points_for,
        wins: data.teams[tidx + 1].settings.wins,
        losses: data.teams[tidx + 1].settings.losses,
        efficiency:
          (data.teams[tidx + 1].settings.fpts +
            data.teams[tidx + 1].settings.fpts_decimal / 100) /
          max_points_for,
      };
    });
    // .sort((t1, t2) => t2.val - t1.val);

    // X_norm = (X - X.min()) / (X.max() - X.min())

    const min_avg = Math.min.apply(Math, all_avgs);
    const max_avg = Math.max.apply(Math, all_avgs);
    const avg_diff = max_avg - min_avg;
    const min_mpf = Math.min.apply(Math, all_mpfs);
    const max_mpf = Math.max.apply(Math, all_mpfs);
    const mpf_diff = max_mpf - min_mpf;

    setPowerRankData({
      data: raw_data,
      min_avg: min_avg,
      avg_diff: avg_diff,
      min_mpf: min_mpf,
      mpf_diff: mpf_diff,
    });
  }, [
    data.league.settings.last_scored_leg,
    data.league.total_rosters,
    data.matchups,
    data.teams,
  ]);

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
  }, [
    powerRankSliders,
    powerRankData.avg_diff,
    powerRankData.data,
    powerRankData.min_avg,
    powerRankData.min_mpf,
    powerRankData.mpf_diff,
  ]);

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

  const buildPowerRanks = () => {
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
          <div style={{ margin: "0.25rem", width: "2rem"}}>#{tidx + 1}</div>
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
      <div style={{ margin: "1rem" }}>
        <h1>
          Power Rankings {"(Week " + data.league.settings.last_scored_leg + ")"}
        </h1>
        <p>
          Adjust the sliders according to your weight preferences for different
          criteria.
        </p>
      </div>

      <Form style={{ margin: "1rem" }}>
        <Form.Group as={Row}>
          <Col xs={3}>
            <div>{"Four-Week Average (" + powerRankSliders.four_week_avg + ")"}</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.four_week_avg}
              onChange={(e) =>
                handleSliderUpdate("four_week_avg", e.target.value)
              }
            />
          </Col>
          <Col xs={3}>
            <div>{"Max Points-For (" + powerRankSliders.max_points_for + ")"}</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.max_points_for}
              onChange={(e) =>
                handleSliderUpdate("max_points_for", e.target.value)
              }
            />
          </Col>
          <Col xs={3}>
            <div>{"Win Percentage: (" + powerRankSliders.win_pct + ")"}</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.win_pct}
              onChange={(e) => handleSliderUpdate("win_pct", e.target.value)}
            />
          </Col>
          <Col xs={3}>
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
      <div style={{ margin: "1rem" }}>
        <h2>Rankings</h2>
        {buildPowerRanks()}
      </div>
      <div style={{ margin: "1rem" }}>
        <h2>Data</h2>
        <Row>
          <Col xs={3}>
            <b>Team</b>
          </Col>
          <Col xs={2}>
            <b>Four Week Average</b>
          </Col>
          <Col xs={2}>
            <b>Max Points For</b>
          </Col>
          <Col xs={2}>
            <b>Record</b>
          </Col>
          <Col xs={2}>
            <b>Efficiency</b>
          </Col>
        </Row>
        {powerRankData.data.map((team) => (
          <Row>
            <Col xs={3}>
              <div>{team.name}</div>
            </Col>
            <Col xs={2}>
              <div>{team.four_week_avg}</div>
            </Col>
            <Col xs={2}>
              <div>{team.max_points_for}</div>
            </Col>
            <Col xs={2}>
              <div>
                {team.wins +
                  "-" +
                  team.losses +
                  " (" +
                  (100 * team.win_pct).toFixed(0) +
                  "%)"}
              </div>
            </Col>
            <Col xs={2}>
              <div>{(100 * team.efficiency).toFixed(2) + "%"}</div>
            </Col>
          </Row>
        ))}
      </div>
    </Container>
  );
}
