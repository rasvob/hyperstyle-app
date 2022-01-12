import './App.css';
import 'animate.css'
import { MenuBar } from "./Components/MenuBar";
import VideoCapture from './Components/VideoCapture';
import { Route, Routes } from 'react-router-dom';
import PhotoGrid from './Components/PhotosGrid';
import HeroPage from './Components/HeroPage';
import Footer from './Components/Footer';
import ResultsScreen from './Components/ResultsScreen';
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
     <div data-theme='emerald'>
        <Toaster position="top-center"/>
        <MenuBar />
        <Routes>
          <Route path='/' element={<HeroPage />} />
          <Route path='/capture' element={<VideoCapture />} />
          <Route path='/photos' element={<PhotoGrid />} />
          <Route path='/results' element={<ResultsScreen />} />
        </Routes>
        <Footer />
      </div> 
  );
}