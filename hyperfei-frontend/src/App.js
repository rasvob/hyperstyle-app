import './App.css';
import { MenuBar } from "./Components/MenuBar";
import WebcamSetup from "./Components/WebcamSetup";
import VideoCapture from './Components/VideoCapture';
import { Route, Routes, useLocation } from 'react-router-dom';
import PhotoGrid from './Components/PhotosGrid';
import HeroPage from './Components/HeroPage';
import Footer from './Components/Footer';


export default function App() {
  return (
     <div data-theme='emerald'>
        <MenuBar />
        

        <Routes>
          <Route path='/' element={<HeroPage />} />
          <Route path='/capture' element={<VideoCapture />} />
          <Route path='/photos' element={<PhotoGrid />} />
          <Route path='/result' element={<PhotoGrid />} />
        </Routes>
        <Footer />
      </div> 
  );
}