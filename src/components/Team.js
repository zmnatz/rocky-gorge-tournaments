import React from 'react';
import {Grid} from 'semantic-ui-react';

const Team = ({team}) => 
  <Grid.Row>
    <Grid.Column width={4}>{team.name}</Grid.Column>
    <Grid.Column>{team.wins}</Grid.Column>
    <Grid.Column>{team.losses}</Grid.Column>
    <Grid.Column>{team.ties}</Grid.Column>
    <Grid.Column>{team.pf}</Grid.Column>
    <Grid.Column>{team.pa}</Grid.Column>
  </Grid.Row>
export default Team;
