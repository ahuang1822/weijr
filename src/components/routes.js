import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import AllWagers from './AllWagers';
import App from './App'
import SingleWagerView from './SingleWagerView';
import CreateWager from './CreateWager';
import ProfilePage from './ProfilePage'
import DirectChatCreation from './DirectChat/index'
import GeneralChat from './GeneralChat'
import NBASchedule from './NBASchedule'
import PremierLeagueSchedule from './PremierLeagueSchedule';
import SignUpPage from './SignUpPage';


class Routes extends Component {

  render () {
    return (
      <Switch>
        <Route exact path="/" component={ App } />
        <Route exact path="/signup" component={ SignUpPage } />
        <Route exact path='/new-wager' component={ CreateWager } />
        <Route exact path="/wagers" component={ AllWagers } />
        <Route exact path="/wagers/:address" component={SingleWagerView} />
        <Route exact path="/your-profile" component={ProfilePage} />
        <Route exact path='/privateMessages' component={DirectChatCreation} />
        <Route exact path='/privateChat' component={ GeneralChat } />
        <Route exact path='/nbaSchedule' component={ NBASchedule } />
        <Route exact path='/eplSchedule' component={ PremierLeagueSchedule } />
        <Redirect from="*" to="/" />
      </Switch>
    )
  }
}

export default withRouter(Routes)
