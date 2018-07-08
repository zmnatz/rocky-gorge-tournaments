import React from 'react';
import {Tab, Segment} from 'semantic-ui-react';

import Schedule from './Schedule';
import {TeamList} from './Teams';

import {DIVISIONS} from '../utils/constants'

export default ({teams, games, settings}) => <Segment>
  <Tab panes={[
    {
      menuItem: 'Schedule',
      render: () => 
        <Schedule readOnly games={games} teams={teams} settings={settings}/>
    },
    ...DIVISIONS.map(division => ({
      menuItem: division,
      render: () => <Tab.Pane>
        <TeamList
          division={division} 
          teams={teams.filter(team => team.division === division)}
        />
      </Tab.Pane>
    }))
  ]}/>
</Segment>