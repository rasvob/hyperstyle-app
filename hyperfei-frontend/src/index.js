import React from 'react';
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Router
} from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Toaster } from "react-hot-toast";


const rootElement = document.getElementById("root");
render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </RecoilRoot>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
