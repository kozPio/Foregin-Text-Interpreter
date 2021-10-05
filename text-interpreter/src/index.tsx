import React from 'react';
import  ReactDOM  from "react-dom";
import './App.css';
import AppView from './components.ts/AppView';

const App = () => {

  return (
  
    <div>
    <AppView  />
    </div>);
  
};




ReactDOM.render(
  <App />,
  document.querySelector('#root')
);