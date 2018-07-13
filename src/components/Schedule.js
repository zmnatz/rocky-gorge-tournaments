import React, {Component} from 'react';
import {Card, Segment, Menu, Sidebar, Button} from 'semantic-ui-react'

import Game from './Game';
import { groupBy } from '../utils';

const FilterMenu = ({filter, onToggle, visible, onSelect}) => 
  <div>
    <Button basic color="blue" 
      icon={visible ? "delete" : "bars"}
      content={visible ? "Close Filter" : "Filter Teams"} 
      onClick={onToggle}
    />
    {filter ? 
      <Button basic color="red" icon="delete" content={filter} 
        onClick={onSelect}/> 
      : ''
    }
  </div>

const TeamMenu = ({teams, visible, onSelect}) => {
  const sortedTeams = [...teams];
  sortedTeams.sort((a,b) => a.name.localeCompare(b.names))
  return <Sidebar as={Menu} 
    visible={visible}
    animation='push'
    vertical
    inverted
  >
    <Menu.Item as='a' onClick={onSelect.bind(this, false)}>
      All Teams
    </Menu.Item>
    {teams.map(team => 
      <Menu.Item key={team.name + team.division} as='a' content={`${team.name} - ${team.division}`}
          onClick={onSelect.bind(this, team.id)} />
    )}
  </Sidebar>
}

export default class Schedule extends Component {
  state = {
    sidebar: false,
    selected: false
  }

  _handleSidebar = () => 
    this.setState(prev => ({sidebar: !prev.sidebar}))
  _handleSelect = (team) => 
    this.setState({selected: team})
  
  render () {
    const {games, readOnly, teams, editable} = this.props,
      {selected} = this.state,
      filteredGames = games.filter(game => 
        !selected || 
        game.home.id === selected ||
        game.away.id === selected
      ),
      rounds = groupBy(filteredGames, 'time'),
      times = Object.keys(rounds);
    return <Segment basic loading={times.length < 1}>
      <FilterMenu filter={!selected ? false : teams.find(team => team.id === selected).name}
        visible={this.state.sidebar}
        onToggle={this._handleSidebar}
        onSelect={this._handleSelect.bind(this, false)}
      />
      <Sidebar.Pushable as={Segment}>
        <TeamMenu teams={teams} visible={this.state.sidebar}
          onSelect={this._handleSelect} />
        
        <Sidebar.Pusher>
          <Segment.Group style={{minHeight: 300}}> { times.map((round) =>
            <Segment key={round}>
              <h3>{round}</h3>
              <Card.Group>
                {rounds[round].map((game) =>
                  // <Card key={game.id}>foo</Card>
                  <Game key={game.id} 
                    readOnly={readOnly} 
                    game={game} 
                    field={game.field} 
                    editable={editable}
                  />
                )}
              </Card.Group>
            </Segment>
          )} </Segment.Group>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Segment>
  }
}