import React, { Component } from 'react';
import Header from './componentes/Header'
import Timeline from './componentes/Timeline';
import Toast from './componentes/Toast';
import TimelineStore from './logicas/TimelineStore';
import {createStore} from 'redux';

const timelineStore = new TimelineStore([]);

//REDUCER
function timeline(state=[], action){
  if(action.type === 'LISTAGEM'){
    console.log('entrou na listagem');
    return action.fotos;
  }

  return state;
}

const store = createStore(timeline);

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header  store={timelineStore}/>
          <Timeline login={this.props.params.login} store={store}/>
          <Toast />
        </div>
      </div>
    );
  }
}

export default App;
