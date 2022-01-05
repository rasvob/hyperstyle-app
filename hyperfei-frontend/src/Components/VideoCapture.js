import React, {useCallback, useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import { videoCaptureState } from "../DAL/DataStore";
import { useRecoilCallback, useRecoilState } from "recoil";
import * as faceapi from 'face-api.js';
import { TinyFaceDetectorOptions } from "face-api.js";

const videoConstraints = {
    facingMode: "user",
    frameRate: { ideal: 25 }
};

const ImagePreview = ({vidState}) => {
    let filteredState = vidState;
    if (vidState.length >= 6) {
        filteredState = vidState.slice(vidState.length - 6);
    }

    return (
        filteredState.map((x, i) => (
            <img src={x} key={`img_bottom_${i}`} className="img aspect-square rounded-md" />
        ))
    );
};

const VideoCapture = () => {
    const [videoState, setVideoCaptureState] = useRecoilState(videoCaptureState);
    const [currentImage, setCurrentImage] = useState(null);
    const currentImgRef = useRef(null);
    const webcamRef = useRef(null);
    const showImg = useRef(null);
    const mediaRecorderRef = React.useRef(null);
    let previousDetection = null;

    const capture = useRecoilCallback(({snapshot, set}) => async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const st = snapshot.getLoadable(videoCaptureState).contents;
            set(videoCaptureState, [...st, imageSrc]);
            setCurrentImage(imageSrc);
            return imageSrc;
        },
        [webcamRef]
    );

    const capture2 = useRecoilCallback(({snapshot, set}) => async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const st = snapshot.getLoadable(videoCaptureState).contents;
        set(videoCaptureState, [...st, imageSrc]);
        setCurrentImage(imageSrc);
    },
    [webcamRef]
    );

    const modifyCanvas = (e) => {
        const cnvs = webcamRef.current.getCanvas();
        const ctx = cnvs.getContext("2d");

        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();

    };

    const detectFace = async () => {
        // const detection = await faceapi.tinyFaceDetector(currentImgRef.current);
        // const cnvs = currentImgRef.current;
        const cnvs = webcamRef.current.getCanvas();
        const ctx = cnvs.getContext("2d");

        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.stroke();
        const detection = await faceapi.detectSingleFace(webcamRef.current.video);//.withAgeAndGender().withFaceExpressions();
        if (detection) {
            faceapi.draw.drawDetections(ctx, detection);
        }
    };

    const showCurrentImage = (e) => {
        e.preventDefault();
        const cnvs = currentImgRef.current;
        const ctx = cnvs.getContext("2d");
        ctx.drawImage(showImg.current, 0, 0);
    };

    useEffect(async () => {
        await faceapi.loadTinyFaceDetectorModel('/models');
        console.info("Models loaded");

        const timeoutHandle = async () => {
            const frame = await capture();
            const cnvs = currentImgRef.current;
            const ctx = cnvs.getContext("2d");
            const detection = await faceapi.tinyFaceDetector(cnvs, new TinyFaceDetectorOptions({scoreThreshold: 0.2}));
            ctx.drawImage(showImg.current, 0, 0);
            if (detection) {
                faceapi.draw.drawDetections(ctx, detection);
            }
        };
        const tId = setInterval(timeoutHandle, 40);

        // mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        //     mimeType: "video/webm"
        //   });

        // mediaRecorderRef.current.ondataavailable = handleWebcamFrame;
        // // mediaRecorderRef.current.start(1000);

        // console.log(mediaRecorderRef.current);
        
        return () => {clearInterval(tId)};
    }, [])


    return (
            <div className="container my-10 mx-auto min-h-screen">
                <div className="card shadow-md -mt-64 text-black">
                    
                    <div className="card-body bg-white">
                    <div className="card-title text-primary font-bold">Video capture</div>
                    <div className="md:flex">
                        <div className="flex-grow">
                            <div className="flex gap-1">
                                <button className="btn" onClick={capture}>Capture photo</button>
                                <button className="btn" onClick={detectFace}>Detect face</button>
                                <button className="btn" onClick={showCurrentImage}>Show face</button>
                                <button className="btn" onClick={modifyCanvas}>Mod face</button>
                            </div>
                        </div>

                        <div>
                            <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={768}
                            videoConstraints={videoConstraints}
                            className="rounded-md invisible z-0 h-0"
                            />

                        <canvas ref={currentImgRef} width={768} height={576} className="z-10">
                            <img ref={showImg} src={currentImage} width={512} height={256} />
                        </canvas>
                        </div>
                    </div>

                    <div>
                        
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