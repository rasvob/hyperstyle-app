import './App.css';
import { MenuBar } from "./Components/MenuBar";
import WebcamSetup from "./Components/WebcamSetup";
import VideoCapture from './Components/VideoCapture';
import { Route, Routes } from 'react-router-dom';


export default function App() {
  return (
     <div data-theme='emerald'>
        <MenuBar />
        <div className="hero h-96 bg-gradient-to-br from-primary to-secondary text-primary-content">
            {/* <WebcamSetup /> */}
        </div>

        <Routes>
          <Route path='/' element={<VideoCapture />} />
          <Route path='/photos' element={<div>PHOTOS</div>} />
        </Routes>
      </div> 
  );
}