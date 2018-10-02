import React, { Component } from 'react';
import Header from './componentes/Header'
import Timeline from './componentes/Timeline';
import Toast from './componentes/Toast';
import LogicaTimeLine from './logicas/LogicaTimeLine';

const logicaTimeline = new LogicaTimeLine([]);

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header  logicaTimeline={logicaTimeline}/>
          <Timeline login={this.props.params.login} logicaTimeline={logicaTimeline}/>
          <Toast />
        </div>
      </div>
    );
  }
}

export default App;
