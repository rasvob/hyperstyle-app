import { useRecoilState } from "recoil";
import { videoCaptureState } from "../DAL/DataStore";


const PhotoGrid = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState); 
    


};

export default PhotoGrid;