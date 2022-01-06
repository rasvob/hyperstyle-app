import { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getActiveRoute, postSelectedImage } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState } from "../DAL/DataStore";


const PhotoGrid = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState); 
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);
    const [resImg, setResImg] = useState(null);
    
    const selectImage = (e, idx) => {
        e.preventDefault();
        console.log(selectedImage);
        let r = {...selectedImage, index: idx, data: videoState[idx]};
        setSelectedImage(r);
    };

    const apiCall = async (e) => {
        e.preventDefault();
        const res = await getActiveRoute();
        console.log(res);

        try {
            const res2 = await postSelectedImage(selectedImage.data);
            console.log(res2);
            setResImg(`data:image/jpeg;base64,${res2}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-5 gap-6 justify-items-center my-6">
                {
                    videoState.map((x, i) => (
                        <div className="indicator">
                            {i == selectedImage.index && <div class="indicator-item badge badge-primary">✔ Selected</div> }
                            <img onClick={(e) => selectImage(e, i)} alt="" src={x} key={`img_gallery_${i}`} className="img rounded-md hover:grayscale cursor-pointer" />
                        </div>
                    ))
                }
                
            </div>

            <Link className="btn btn-error" to="/">Go back</Link>
            <div>
                <button className="btn btn-primary my-4" onClick={apiCall}>API Call</button>
            </div>
            
            {
                
            }

            <img src={resImg} className="w-60 h-60" />
        </div>
    );
};

export default PhotoGrid;