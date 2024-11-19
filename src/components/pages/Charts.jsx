// const mid = data.matchups[i][j].matchup_id;
// const name = data.teams[data.matchups[i][j].roster_id].name;
// const points = data.matchups[i][j].points;
// if (!(mid in current_week)) {
//   current_week[mid] = {};
//   current_week[mid].t1 = { name: name, points: points };
// } else {
//   current_week[mid].t2 = { name: name, points: points };
// }

// let cw = [];
// for (let k = 1; k <= data.league.total_rosters; k++) {
//   cw.push(current_week[k]);
// }
// ws.push(cw);