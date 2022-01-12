import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { videoCaptureState, selectedImageState } from "../DAL/DataStore";




const PhotoGrid = () => {
    const [videoState] = useRecoilState(videoCaptureState); 
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);
    const resetSelectedImage = useResetRecoilState(selectedImageState);
    
    const navigate = useNavigate();
    
    const selectImage = (e, idx) => {
        e.preventDefault();
        let r = {...selectedImage, index: idx, data: videoState[idx]};
        setSelectedImage(r);
    };

    const goBack = (e) => {
        e.preventDefault();
        toast("REALLY?!?!?! 😡 Just kiddin' let's get to it 😇"); 
        navigate('/capture');
    };

    useEffect(() => {
        resetSelectedImage();
    }, []);

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-5 gap-6 justify-items-center my-6">
                {
                    videoState.map((x, i) => (
                        <div className="indicator" key={`img_gallery_${i}`}>
                            {i === selectedImage.index && <div className="indicator-item badge badge-primary">✔ Selected</div> }
                            <img onClick={(e) => selectImage(e, i)} alt="" src={x} className={`img rounded-md ${i !== selectedImage.index && 'grayscale'} hover:grayscale-0 cursor-pointer`} />
                        </div>
                    ))
                }
                
            </div>

            <div className="flex justify-between mb-6">
                <button className="btn btn-error" onClick={goBack}>I want to recapture the photos</button>
                <Link disabled={!selectedImage.data ? 'disabled' : ''} className="btn btn-primary" to='/results'>Apply filters to the selected image</Link>
            </div>


            {/* <div className="flex-row flex gap-4">
                <img src={resImgToonify} className="w-60 h-60" />
                <img src={resImgPixar} className="w-60 h-60" />
                <img src={resImgSketch} className="w-60 h-60" />
                <img src={resImgDisney} className="w-60 h-60" />
            </div> */}
            
        </div>
    );
};

export default PhotoGrid;