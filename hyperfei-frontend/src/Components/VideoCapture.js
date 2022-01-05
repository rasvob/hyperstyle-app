import React from "react";
import Webcam from "react-webcam";
import { videoCaptureState } from "../DAL/DataStore";
import { useRecoilCallback, useRecoilState } from "recoil";
import * as faceapi from 'face-api.js';

const videoConstraints = {
    facingMode: "user"
};

const ImagePreview = ({vidState}) => {
    let filteredState = vidState;
    if (vidState.length >= 6) {
        filteredState = vidState.slice(vidState.length - 6);
    }

    return (
        filteredState.map(x => (
            <img src={x} className="img aspect-square rounded-md" />
        ))
    );
};

const VideoCapture = () => {
    console.log(faceapi.nets);

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
                    <div className="md:flex">
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
                            className="rounded-md"
                            />
                        </div>
                    </div>
                    
                    <h1>Preview images</h1>
                    <ul className="md:columns-6">
                        <ImagePreview vidState={videoState} />
                    </ul>
                    
                    
                    </div>
                </div> 
            </div>
    );
};

export default VideoCapture;