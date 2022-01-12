import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { getActiveRoute, postSelectedImage, postSelectedImageFake, postSelectedImageFail } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState } from "../DAL/DataStore";




const PhotoGrid = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState); 
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);
    const resetSelectedImage = useResetRecoilState(selectedImageState);
    const [resImgToonify, setResImgToonify] = useState(null);
    const [resImgPixar, setResImgPixar] = useState(null);
    const [resImgSketch, setResImgSketch] = useState(null);
    const [resImgDisney, setResImgDisney] = useState(null);

    const navigate = useNavigate();
    
    const selectImage = (e, idx) => {
        e.preventDefault();
        console.log(selectedImage);
        let r = {...selectedImage, index: idx, data: videoState[idx]};
        setSelectedImage(r);
    };

    const apiCall = async (e) => {
        e.preventDefault();

        try {
            const res2 = await postSelectedImage(selectedImage.data);
            setResImgToonify(res2['GeneratorTypes.TOONIFY']);
            setResImgPixar(res2['GeneratorTypes.PIXAR']);
            setResImgSketch(res2['GeneratorTypes.SKETCH']);
            setResImgDisney(res2['GeneratorTypes.DISNEY_PRINCESS']);

            console.log(res2);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        resetSelectedImage();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-5 gap-6 justify-items-center my-6">
                {
                    videoState.map((x, i) => (
                        <div className="indicator">
                            {i === selectedImage.index && <div class="indicator-item badge badge-primary">✔ Selected</div> }
                            <img onClick={(e) => selectImage(e, i)} alt="" src={x} key={`img_gallery_${i}`} className="img rounded-md hover:grayscale cursor-pointer" />
                        </div>
                    ))
                }
                
            </div>

            <button className="btn btn-error" onClick={(e) => {toast("REALLY?!?!?! 😡 Just kiddin' let's get to it 😇"); navigate('/capture');}}>I want to recapture the photos</button>
            <div>
                <button className="btn btn-primary my-4" onClick={apiCall}>API Call</button>
                <button className="btn btn-primary my-4" onClick={(e) => {navigate('/results')}}>Results</button>
            </div>


            <div className="flex-row flex gap-4">
                <img src={resImgToonify} className="w-60 h-60" />
                <img src={resImgPixar} className="w-60 h-60" />
                <img src={resImgSketch} className="w-60 h-60" />
                <img src={resImgDisney} className="w-60 h-60" />
            </div>
            
        </div>
    );
};

export default PhotoGrid;