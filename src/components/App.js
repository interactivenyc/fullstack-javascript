import React from 'react';
import Header from './Header';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests'
  };
  componentDidMount() {
    //console.log('componentDidMount');
    //debugger;
    // ajax, timers and listeners
  }
  componentWillUnmount() {
    //console.log('componentWillUnmount');
    //debugger;
    // cleanup memory, timers and listeners
  }
  render() {
    return(
      <div className="App">
        <Header message={this.state.pageHeader}/>
        <div>
          ...
        </div>
      </div>

    );
  }
}

export default App;
