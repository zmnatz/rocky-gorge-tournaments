import React from 'react';
import {Tab, Segment} from 'semantic-ui-react';

import Generator from './Generator';
import Schedule from './Schedule';
import Teams from './Teams';

import {DIVISIONS} from '../utils/constants'

export default ({teams, games, settings}) => <Segment>
  <Generator teams={teams} settings={settings}/>
  <Tab panes={[
    {
      menuItem: 'Schedule',
      render: () => 
        <Schedule games={games} settings={settings} editable/>
    },
    ...DIVISIONS.map(division => ({
      menuItem: division,
      render: () => <Tab.Pane>
        <Teams 
          division={division} 
          teams={teams.filter(team => team.division === division)}
        />
      </Tab.Pane>
    }))
  ]}/>
</Segment>