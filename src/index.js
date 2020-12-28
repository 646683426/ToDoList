import React from 'react';
import ReactDOM from 'react-dom';
import ToDoList from './component/ToDoList';
import reportWebVitals from './reportWebVitals';
import 'lib-flexible'; 

ReactDOM.render(
  <React.StrictMode>
    <ToDoList />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
