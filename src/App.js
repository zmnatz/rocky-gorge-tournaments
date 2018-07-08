import React, { Component } from 'react';
import {Switch, Route} from 'react-router';
import fire from './api/fire';
import 'semantic-ui-css/semantic.min.css';
import {DEFAULT_SCHEDULE} from './components/ScheduleSettings';
import {SCORE_DEFAULTS, determineOutcomes, reverseOutcome} from './utils'
import Admin from './components/Admin';
import View from './components/View';

class App extends Component {
  state = {
    teams: [],
    games: [],
    numFields: 3,
    settings: DEFAULT_SCHEDULE
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

    teamsRef.on('child_removed', snapshot =>
      this.setState(prev => ({
        teams: {
          ...prev.teams,
          [snapshot.key]: undefined
        }
      }))
    )

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
        } else if (prev.games[game.id].complete && !game.complete) {
          teams = reverseOutcome(game, teams);
        }
        return {
          teams,
          games: {...prev.games, [game.id]: game}
        }
      })
    })

    fire.database().ref('scheduleSettings').on('value', snapshot =>
      this.setState({settings: snapshot.val()})
    );
  }

  addTeam(newTeam) {
    fire.database().ref('teams').push({
      ...newTeam,
      ...SCORE_DEFAULTS
    });
  }

  render() {
    const {games, settings} = this.state,
      teams = Object.values(this.state.teams).filter(team => team);

    return <Switch>
      <Route path="/admin" exact render={()=> 
        <Admin teams={teams} games={games} settings={settings}/>
      }/>
      <Route path="/" exact render={()=>
        <View teams={teams} games={games} settings={settings}/>
      }/>
    </Switch>
  }
}

export default App;