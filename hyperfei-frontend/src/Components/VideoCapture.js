import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import { videoCaptureState, framesCapturedState, styleTransferedImagesState, lastSelectedWebcamState } from "../DAL/DataStore";
import { useRecoilCallback, useRecoilState, useResetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { Instagram } from 'react-content-loader';

const VideoCapture = () => {
    const MAX_FRAMES = 10;
    const RES = 512;

    const [, setVideoState] = useRecoilState(videoCaptureState);
    const [framesCaptured, setFramesCaptured] = useRecoilState(framesCapturedState);
    const resetStyleTransferedImages = useResetRecoilState(styleTransferedImagesState)
    const [captureRunning, setCaptureRunning] = useState(false);
    const [isWebcameraReady, setIsWebcameraReady] = useState(false);
    const webcamRef = useRef(null);
    const timerRef = useRef(null);
    const [devices, setDevices] = React.useState([]);
    const [lastWebcam, setLastWebcam] = useRecoilState(lastSelectedWebcamState);

    const handleDevices = React.useCallback(
        mediaDevices => {
            const dev = mediaDevices.filter(({ kind }) => kind === "videoinput");
            setDevices(dev);
        },
        [setDevices]
    );

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    useEffect(() => {
        setVideoConstraints(prev => {return {...prev, deviceId: lastWebcam}});
    }, [lastWebcam])

    const [videoConstraints, setVideoConstraints] = useState({
        facingMode: "user",
        frameRate: { ideal: 30 },
        width: RES,
        height: RES,
        deviceId: lastWebcam
    });

    const capture = useRecoilCallback(({snapshot, set}) => async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const st = snapshot.getLoadable(videoCaptureState).contents;
            const frames = snapshot.getLoadable(framesCapturedState).contents;
            set(videoCaptureState, [...st, imageSrc]);
            set(framesCapturedState, frames+1);
        },
        [webcamRef]
    );

    const resetCapture = useCallback(() => {
        setCaptureRunning(false);
        setFramesCaptured(0);
        setVideoState([]);
        resetStyleTransferedImages();
    }, [setCaptureRunning, setFramesCaptured, setVideoState, resetStyleTransferedImages]);

    const resetClicked = () => {
        resetCapture();
        toast.error('We may start over 😪');
    };

    const onMediaObtained = (e) => {
        setIsWebcameraReady(true);
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
    }, [framesCaptured, captureRunning]);

    useEffect(() => {
        resetCapture();
    }, [resetCapture]);

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
    }, [captureRunning, capture]);

    

    return (
            <div className="container mx-auto mt-5">
                    <h1 className="font-semibold text-primary text-xl">{framesCaptured} out of {MAX_FRAMES} selfies captured</h1>
                    <progress className="progress progress-primary my-4" value={framesCaptured} max={MAX_FRAMES}></progress> 
                    <div className="">
                        <div className="mx-auto flex justify-center">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width={512}
                                height={512}
                                videoConstraints={videoConstraints}
                                className="rounded-md"
                                mirrored={true}
                                onUserMedia={onMediaObtained}
                            />
                        </div>

                        {!isWebcameraReady &&
                            <div className="-mt-64 mx-auto flex justify-center inset-0" style={{width: '512px', height: '512px'}}>
                                <Instagram width={512} height={512} />
                            </div>
                        }
                    </div>
                    
                    <div className="my-5 flex mx-auto justify-between" style={{width: '512px'}} >
                        <div className="flex gap-3">
                            <button disabled={framesCaptured > 0 || captureRunning || !isWebcameraReady ? 'disabled' : ''} className="btn btn-secondary" onClick={startCapture}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>

                            <button disabled={framesCaptured < MAX_FRAMES ? 'disabled' : ''} className="btn btn-error" onClick={resetClicked}>Reset</button>
                            
                            <div className={`dropdown dropdown-right dropdown-end ${captureRunning || !isWebcameraReady ? '' : 'dropdown-hover'}`}>
                            <button disabled={captureRunning || !isWebcameraReady ? 'disabled' : ''} tabIndex="0" className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-60">
                                {
                                    devices.map((v, i) => {
                                      return (
                                        <li key={`device-key-${i}`}>
                                            <a href="blan.k" role="menuitem" onClick={(e) => {e.preventDefault(); setLastWebcam(v.deviceId); toast('Wait a moment. Setting camera device.')}}>{v.label}</a>
                                        </li> 
                                      );  
                                    })
                                }
                                
                                
                            </ul>
                            </div>
                        </div>
                        <Link disabled={framesCaptured < MAX_FRAMES ? 'disabled' : ''} className={`btn btn-primary justify-end ${framesCaptured >= MAX_FRAMES ? 'animate__animated' : ''} animate__hearthbeat animate__slow animate__infinite`} to='/photos' >Select selfie</Link>
                    </div>
            </div>
    );
};

export default VideoCapture;