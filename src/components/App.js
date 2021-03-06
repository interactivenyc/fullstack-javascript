/*eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from '../api';

const pushState = (obj, url) => {
  console.log('[App] pushState: ', obj);
  window.history.pushState(obj, '', url);
};

const onPopState = (handler) => {
  window.onpopstate = handler;
};



class App extends React.Component {
  static propTypes = {
    initialData: PropTypes.object.isRequired
  };

  state = this.props.initialData;
  skipPushState = false;

  componentDidMount() {
    console.log('[App] componentDidMount');
    onPopState((event) => {
      console.log('[App] onPopState: ', event.state);
      this.setState({
        currentContestId: (event.state || {}).currentContestId
      });
    });
  }

  componentWillUnmount() {
    // clean timers, listeners
    onPopState(null);
  }

  fetchContest = (contestId) => {
    console.log('[App] fetchContest');
    if (this.skipPushState) {
      this.skipPushState = false;
    } else {
      pushState(
        { currentContestId: contestId },
        `/contest/${contestId}`
      );
    }

    api.fetchContest(contestId).then(contest => {
      this.setState({
        currentContestId: contest._id,
        contests: {
          ...this.state.contests,
          [contest._id]: contest
        }
      });
    });
  }

  fetchContestList = () => {
    pushState(
      { currentContestId: null },
      '/'
    );
    api.fetchContestList()
      .then(contests => {
        this.setState({
          currentContestId: null,
          contests
        });
      });
  }

  fetchNames = (nameIds) => {
    if (nameIds.length === 0){
      return;
    }
    api.fetchNames(nameIds)
      .then(names => {
        this.setState({
          names
        });
      });
  }

  currentContest() {
    return this.state.contests[this.state.currentContestId];
  }

  pageHeader() {
    if (this.state.currentContestId) {
      return this.currentContest().contestName;
    }

    return 'Naming Contests';
  }

  lookupName = (nameId) => {
    if (!this.state.names || !this.state.names[nameId]) {
      return {
        name: '...'
      };
    }
    return this.state.names[nameId];
  }

  addName = (newName, contestId) => {
    //call api
    console.log('addName: ', newName, contestId);
    api.addName(newName, contestId).then(resp =>
      this.setState({ // update list of contests with new name
        contests: {
          ...this.state.contests,
          [resp.updatedContest._id]: resp.updatedContest
        },
        names: {
          ...this.state.names,
          [resp.newName._id]: resp.newName
        }
      })
    )
      .catch(console.error());
  }

  currentContent() {
    if (this.state.currentContestId) {
      if (!this.state.contests[this.state.currentContestId].description) {
        console.log('[App] TODO: Fix this bug properly. Shouldn\'t need skipPushState');

        // This only happens when using the back button. Fetching the
        // contest this way forces the page to load properly, but a
        // pushState is happening when it shouldn't

        this.skipPushState = true;
        this.fetchContest(this.state.currentContestId);
      } else {
        return <Contest
          contestListClick={this.fetchContestList}
          fetchNames={this.fetchNames}
          lookupName={this.lookupName}
          addName={this.addName}
          {...this.currentContest()} />;
      }

    }

    return <ContestList
      onContestClick={this.fetchContest}
      contests={this.state.contests} />;
  }

  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContent()}
      </div>
    );
  }
}

export default App;
