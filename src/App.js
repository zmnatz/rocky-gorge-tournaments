import React, { Component } from 'react'
import Teams from './components/Teams/Teams';
import Schedule from './components/Schedule';
import Generator from './components/Generator';
import fire from './api/fire';
import 'semantic-ui-css/semantic.min.css';

const resetScore = (id, teams) => {
  return {
    ...teams,
    [id]: {...SCORE_DEFAULTS}
  }
}

const determineOutcomes = (game, teams) => {
  console.log(game);
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
      away.losses++;
    } else if (game.score.away > game.score.home) {
      home.losses++;
      away.wins++;
    } else {
      home.ties++;
      away.ties++;
    }
  }
  return teams;
}

const SCORE_DEFAULTS = {
  wins: 0,
  ties: 0,
  losses: 0,
  pa: 0,
  pf: 0
}

class App extends Component {
  state = {
    teams: [],
    games: [],
    numFields: 3
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let teamsRef = fire.database().ref('teams').orderByKey();
    teamsRef.on('child_added', snapshot => {
      this.setState(prev => {
        const prevTeam = prev.teams[snapshot.key] || SCORE_DEFAULTS;
        let team = { 
          ...prevTeam,
          ...snapshot.val(), 
          id: snapshot.key
        };
        return {
          teams: {...prev.teams, [team.id]: team}
        } 
      });
    })

    let gamesRef = fire.database().ref('games').orderByKey();

    gamesRef.on('child_added', snapshot => {
      const game = {...snapshot.val(), id: snapshot.key};
      
      this.setState(prev => {
        let teams = prev.teams;
        if (game.complete) {
          teams = determineOutcomes(game, teams);
        }
        return {
          teams,
          games: {...prev.games, [game.id]: game}
        }
      });
    });
    gamesRef.on('child_removed', snapshot => 
      this.setState({games: []})
    )

    gamesRef.on('child_changed', snapshot => {
      const game = {...snapshot.val()};
      
      this.setState(prev => {
        let teams = prev.teams;
        if (game.complete) {
          teams = determineOutcomes(game, teams);
        }
        return {
          teams,
          games: {...prev.games, [game.id]: game}
        }
      })
    })
  }

  addTeam(newTeam) {
    fire.database().ref('teams').push({
      ...newTeam,
      ...SCORE_DEFAULTS
    });
  }

  byDivision = (things, division) => 
    Object.values(things).filter(thing => thing.division === division);

  render() {
    const {teams, games} = this.state;

    // determineOutcomes(games, teams);

    return <div>
      <div style={{display: 'flex'}}>
        <Teams division="Open" teams={this.byDivision(teams, 'Open')} onSubmit={this.addTeam}/>
        <Teams division="Social" teams={this.byDivision(teams, 'Social')} onSubmit={this.addTeam}/>
        <Teams division="Womens" teams={this.byDivision(teams, 'Womens')} onSubmit={this.addTeam}/>
      </div>
      <Generator teams={Object.values(teams)}/>
      <Schedule games={games}/>
    </div>
  }
}

export default App;