import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import { videoCaptureState, framesCapturedState } from "../DAL/DataStore";
import { atom, useRecoilCallback, useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast'

const videoConstraints = {
    facingMode: "user",
    frameRate: { ideal: 30 },
    width: 512,
    height: 512,
};

const MAX_FRAMES = 10;

const VideoCapture = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState);
    const [framesCaptured, setFramesCaptured] = useRecoilState(framesCapturedState);
    const [captureRunning, setCaptureRunning] = useState(false);
    const webcamRef = useRef(null);
    const timerRef = useRef(null);

    const capture = useRecoilCallback(({snapshot, set}) => async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const st = snapshot.getLoadable(videoCaptureState).contents;
            const frames = snapshot.getLoadable(framesCapturedState).contents;
            set(videoCaptureState, [...st, imageSrc]);
            set(framesCapturedState, frames+1);
        },
        [webcamRef]
    );

    const resetCapture = () => {
        setCaptureRunning(false);
        setFramesCaptured(0);
        setVideoState([]);
    };

    const resetClicked = () => {
        resetCapture();
        toast.error('We may start over 😪');
    };

    const startCapture = () => {
        setCaptureRunning(true);
        toast("Hey! Smile a little!", {
            icon: '😉',
          });
    };

    useEffect(() => {
        if (framesCaptured >= MAX_FRAMES && captureRunning) {
            setCaptureRunning(false);
            toast.success("OK, Everyting set. You may proceed to the next step 🙂")
        }
    }, [framesCaptured]);

    useEffect(() => {
        resetCapture();
    }, []);

    useEffect(() => {
        const timeoutHandle = async () => {
            await capture();
        };

        if (captureRunning) {
            timerRef.current = setInterval(timeoutHandle, 500);

        } else if ((!captureRunning) && timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        return () => {clearInterval(timerRef.current)};
    }, [captureRunning]);

    

    return (
            <div className="container mx-auto mt-5">
                    <h1 className="font-semibold text-primary text-xl">Currently {framesCaptured} out of {MAX_FRAMES} selfies captured</h1>
                    <progress className="progress progress-primary my-4" value={framesCaptured} max={MAX_FRAMES}></progress> 
                    <div className="mx-auto flex justify-center">
                        <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={512}
                        height={512}
                        videoConstraints={videoConstraints}
                        className="rounded-md"
                        />
                        
                    </div>

                    <div className="my-5 flex mx-auto justify-between" style={{width: '512px'}}>
                        <div className="flex gap-3">
                            <button disabled={framesCaptured > 0 || captureRunning ? 'disabled' : ''} className="btn btn-secondary" onClick={startCapture}>Start capture</button>
                            <button disabled={framesCaptured < MAX_FRAMES ? 'disabled' : ''} className="btn btn-error" onClick={resetClicked}>Reset capture</button>
                        </div>
                        <Link disabled={framesCaptured < MAX_FRAMES ? 'disabled' : ''} className={`btn btn-primary justify-end ${framesCaptured >= MAX_FRAMES ? 'animate__animated' : ''} animate__hearthbeat animate__slow animate__infinite`} to='/photos' >Select selfie</Link>
                    </div>
                    
            </div>
    );
};

export default VideoCapture;