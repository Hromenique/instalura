import React, { Component } from 'react';
import Header from './componentes/Header'
import Timeline from './componentes/Timeline';
import Toast from './componentes/Toast';

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header />
          <Timeline login={this.props.params.login}/>
          <Toast />
        </div>
      </div>
    );
  }
}

export default App;
