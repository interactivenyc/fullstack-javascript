import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import ContestList from './ContestList';


class App extends Component {
  state = {
    pageHeader: 'Naming Contests',
    contests: this.props.initialContests
  };
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        <ContestList contests={this.state.contests} />
      </div>
    );
  }
}

App.propTypes = {
  initialContests: PropTypes.array
};

export default App;
