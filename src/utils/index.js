const getPoints = (a) => a.wins * 2 + a.ties;
const getDifferential = (team) => team.pf - team.pa;
const compare = (a,b) => {
  if (a > b) return -1;
  else if (b > a) return 1;
  else return 0;
}

export const SCORE_DEFAULTS = {
  wins: 0,
  ties: 0,
  losses: 0,
  pa: 0,
  pf: 0
}


export const rankTeams = (a, b) => {
  const wins = compare(getPoints(a), getPoints(b)),
    diff = compare(getDifferential(a), getDifferential(b)),
    totalPoints = compare(a.pf, b.pf);
  if (wins !== 0) {
    return wins;
  } else if (diff !== 0) {
    return diff;
  } else if (totalPoints !== 0) {
    return totalPoints;
  // }  else {
  //   const random = Math.random();
  //   if (random >= .5) {
  //     return 1;
  //   } else {
  //     return -1;
  //   }
  }
  return 0;
}

export const handleFocus = ({target}) =>  {
  target.select();
}

export const groupBy = function(xs, key) {
  return xs ? xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {}) : {};
};

export const resetScore = (id, teams) => {
  return {
    ...teams,
    [id]: {...SCORE_DEFAULTS}
  }
}

export const determineOutcomes = (game, teams) => {
  if (!teams[game.home.id]) {
    teams = resetScore(game.home.id, teams);
  }
  if (!teams[game.away.id]) {
    teams = resetScore(game.away.id, teams);
  }
  if (game.complete) {
    const home = teams[game.home.id],
      away = teams[game.away.id];
    home.pf += game.score.home;
    home.pa += game.score.away;
    away.pf += game.score.away;
    away.pa += game.score.home;
    if (game.score.home > game.score.away) {
      home.wins++;
      game.winner = 'home';
      game.loser = 'away';
      away.losses++;
    } else if (game.score.away > game.score.home) {
      home.losses++;
      game.winner = 'away';
      game.loser = 'home';
      away.wins++;
    } else {
      home.ties++;
      away.ties++;
    }
  }
  return teams;
}

export const reverseOutcome = (game, teams) => {
  const home = teams[game.home.id],
    away = teams[game.away.id];
  if (game.winner) {
    const winner = teams[game[game.winner].id],
      loser = teams[game[game.loser].id];
    winner.wins--;
    loser.losses--;
  } else {
    home.ties--;
    away.ties--;
  }
  delete game.winner;
  delete game.loser;
  home.pf -= game.score.home;
  home.pa -= game.score.away;
  away.pf -= game.score.away;
  away.pa -= game.score.home;
  return teams;
}