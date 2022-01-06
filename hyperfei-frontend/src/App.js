import './App.css';
import { MenuBar } from "./Components/MenuBar";
import WebcamSetup from "./Components/WebcamSetup";
import VideoCapture from './Components/VideoCapture';
import { Route, Routes } from 'react-router-dom';
import PhotoGrid from './Components/PhotosGrid';


export default function App() {
  return (
     <div data-theme='emerald'>
        <MenuBar />
        <div className="hero h-44 bg-gradient-to-br from-primary to-secondary text-primary-content">
            {/* <WebcamSetup /> */}
        </div>

        <Routes>
          <Route path='/' element={<VideoCapture />} />
          <Route path='/photos' element={<PhotoGrid />} />
        </Routes>
      </div> 
  );
}