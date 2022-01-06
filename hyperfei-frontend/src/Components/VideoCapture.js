import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import { videoCaptureState, framesCapturedState } from "../DAL/DataStore";
import { atom, useRecoilCallback, useRecoilState } from "recoil";
import { Link } from "react-router-dom";

const videoConstraints = {
    facingMode: "user",
    frameRate: { ideal: 30 },
    width: 512,
    height: 512,
};

const MAX_FRAMES = 10;

const ImagePreview = ({vidState}) => {
    let filteredState = vidState;
    if (vidState.length >= 6) {
        filteredState = vidState.slice(vidState.length - 6);
    }

    return (
        filteredState.map((x, i) => (
            <img src={x} key={`img_bottom_${i}`} className="img aspect-square rounded-md w-24" />
        ))
    );
};

const VideoCapture = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState);
    const [framesCaptured, setFramesCaptured] = useRecoilState(framesCapturedState);
    const [captureRunning, setCaptureRunning] = useState(false);
    const [captureLoopId, setCaptureLoopId] = useState(null);
    const webcamRef = useRef(null);

    const capture = useRecoilCallback(({snapshot, set}) => async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const st = snapshot.getLoadable(videoCaptureState).contents;
            const frames = snapshot.getLoadable(framesCapturedState).contents;
            set(videoCaptureState, [...st, imageSrc]);
            set(framesCapturedState, frames+1);
        },
        [webcamRef]
    );

    const resetCapture = (e) => {
        setCaptureRunning(false);
        setFramesCaptured(0);
        setVideoState([]);
    };

    useEffect(() => {
        const timeoutHandle = async () => {
            await capture();
        };

        if (captureRunning) {
            const tId = setInterval(timeoutHandle, 500);
            setCaptureLoopId(tId);

        } else if ((!captureRunning) && captureLoopId) {
            clearInterval(captureLoopId);
        }
        
        return () => {clearInterval(captureLoopId)};
    }, [captureRunning]);

    useEffect(() => {
        if (framesCaptured >= MAX_FRAMES) {
            setCaptureRunning(false);
        }
    }, [framesCaptured]);

    return (
            <div className="container my-10 mx-auto min-h-screen">
                <div className="card shadow-md -mt-24 text-black">
                    
                    <div className="card-body bg-white">
                    <div className="card-title text-primary font-bold">Video capture</div>

                    <progress className="progress progress-primary my-4" value={framesCaptured} max={MAX_FRAMES}></progress> 

                    <div>
                        <div>
                            <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={512}
                            height={512}
                            videoConstraints={videoConstraints}
                            className="rounded-md"
                            />

                            <button className="btn" onClick={(e) => setCaptureRunning(true)}>Start capture</button>
                            <button className="btn" onClick={(e) => setCaptureRunning(false)}>Stop capture</button>
                            <button className="btn" onClick={resetCapture}>Reset capture</button>
                            <Link className="btn" to='/photos' >Next</Link>
                            <p>{framesCaptured}</p>
                        </div>
                    </div>

                    <div>
                        
                    </div>
                    
                    <h1>Preview images</h1>
                    {/* <ul className="md:columns-6">
                        <ImagePreview vidState={videoState} />
                    </ul> */}
                    
                    
                    </div>
                </div> 
            </div>
    );
};

export default VideoCapture;