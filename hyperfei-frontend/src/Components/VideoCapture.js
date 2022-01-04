import React from "react";
import Webcam from "react-webcam";
import { videoCaptureState } from "../DAL/DataStore";
import { useRecoilCallback, useRecoilState } from "recoil";

const videoConstraints = {
    facingMode: "user"
};

const VideoCapture = () => {
    const [videoState, setVideoCaptureState] = useRecoilState(videoCaptureState);

    const webcamRef = React.useRef(null);

    const capture = useRecoilCallback(({snapshot, set}) => () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const st = snapshot.getLoadable(videoCaptureState).contents;
            set(videoCaptureState, [...st, imageSrc]);
            console.log(st);
        },
        [webcamRef]
    );

    return (
            <div className="container my-10 mx-auto min-h-screen">
                <div className="card shadow-md -mt-64 text-black">
                    
                    <div className="card-body bg-white">
                    <div className="card-title text-primary font-bold">Video capture</div>
                    <div className="flex flex-row">
                        <div className="flex-grow">
                            <button className="btn" onClick={capture}>Capture photo</button>
                        </div>

                        <div>
                            <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={768}
                            videoConstraints={videoConstraints}
                            />
                        </div>
                    </div>
                    
                    <ul>
                        {
                            videoState.map(x => (<li>{x}</li>))
                        }
                    </ul>
                    
                    
                    </div>
                </div> 
            </div>
    );
};

export default VideoCapture;