import { useContext, useState, useEffect } from "react";
import { Container, Form, Col, Row } from "react-bootstrap";
import FormRange from "react-bootstrap/esm/FormRange";

import SLSContext from "../../context/SLSContext";

export default function PowerRankings() {
  const [data] = useContext(SLSContext);

  const [powerRanks, setPowerRanks] = useState([]);
  const [powerRankSliders, setPowerRankSliders] = useState({
    four_week_avg: 10,
    max_points_for: 10,
    win_pct: 5,
    efficiency: 8,
  });
  const [powerRankData, setPowerRankData] = useState({ data: [] });

  const calculateFourWeekAverage = (weekly_points) => {
    let total = 0;
    for (let i = weekly_points.length - 1; i > weekly_points.length - 5; i--) {
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
        points_for:
          data.teams[tidx + 1].settings.fpts +
          data.teams[tidx + 1].settings.fpts_decimal / 100,
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
        const efficiency = team.points_for / team.max_points_for;
        return {
          name: team.name,
          score: (
            four_week_average_norm * powerRankSliders.four_week_avg +
            max_points_for_norm * powerRankSliders.max_points_for +
            team.win_pct * powerRankSliders.win_pct +
            efficiency * powerRankSliders.efficiency
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

  return (
    <Container>
      <div style={{ margin: "1rem" }}>
        {powerRanks.map((team, tidx) => (
          <div key={"team_" + tidx}>
            {tidx + 1}
            {") "}
            {team.name}
            {": "}
            {team.score}
          </div>
        ))}
      </div>
      <Form>
        <Form.Group as={Row}>
          <Col xs={3}>
            <div>Four-Week Average</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.four_week_avg}
              onChange={(e) =>
                handleSliderUpdate("four_week_avg", e.target.value)
              }
            />
            <div>{powerRankSliders.four_week_avg}</div>
          </Col>
          <Col xs={3}>
            <div>Max Points-For</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.max_points_for}
              onChange={(e) =>
                handleSliderUpdate("max_points_for", e.target.value)
              }
            />
            <div>{powerRankSliders.max_points_for}</div>
          </Col>
          <Col xs={3}>
            <div>Win Percentage</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.win_pct}
              onChange={(e) => handleSliderUpdate("win_pct", e.target.value)}
            />
            <div>{powerRankSliders.win_pct}</div>
          </Col>
          <Col xs={3}>
            <div>Efficiency</div>
            <FormRange
              min={0}
              max={10}
              value={powerRankSliders.efficiency}
              onChange={(e) => handleSliderUpdate("efficiency", e.target.value)}
            />
            <div>{powerRankSliders.efficiency}</div>
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
}
