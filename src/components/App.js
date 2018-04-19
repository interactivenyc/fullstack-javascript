import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from '../api';

const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

class App extends Component {
  static propTypes = {
    initialData: PropTypes.object.isRequired
  };
  state = this.props.initialData;
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  fetchContest = (contestId) => {
    pushState(
      {currentContestId: contestId},
      `/contest/${contestId}`
    );


    // lookup the contest
    console.log('[App.js] fetching contest');
    api.fetchContest(contestId)
      .then(contest => {
        console.log(contest);
        this.setState({
          pageHeader: contest.contestName,
          currentContestId: contest.id,
          // update contests object with fetched data from server
          contests: {
            ...this.state.contests,
            [contest.id]: contest
          }

        });
      });


  };
  pageHeader() {
    console.log('[App.js] pageHeader()');
    if (this.state.currentContestId){
      return this.currentContest().contestName;
    }
    return 'Naming Contests';
  }
  currentContest() {
    if (this.state.currentContestId){
      return <Contest {...this.state.contests[this.state.currentContestId]}/>;
    } else {
      return <ContestList
        onContestClick={this.fetchContest}
        contests={this.state.contests}
      />;
    }
  }
  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContest()}
      </div>
    );
  }
}

App.propTypes = {
  initialContests: PropTypes.object
};

export default App;
