import { useState, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getActiveRoute, postSelectedImage } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState } from "../DAL/DataStore";
import ReactToPrint, { useReactToPrint } from 'react-to-print';

export const ComponentToPrint = forwardRef((props, ref) => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState); 

    return (
      <div ref={ref} className="flex flex-col h-screen">
        <div className="">
            <img src='pdf_header.jpg' className="m-5"></img>
        </div>
        <div className="flex-grow mx-5 mt-10">
            <div className="grid grid-cols-2 gap-6 justify-items-center">
                {
                    videoState.slice(0, 4).map((x, i) => (
                        <div className="indicator">
                            <img alt="" src={x} key={`img_gallery_${i}`} className="img rounded-md w-64" />
                        </div>
                    ))
                }
            </div>
        </div>
        <div className=""><img src='pdf_footer.jpg' className="m-5"></img></div>
      </div>
    );
  });

const Example = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
      <div>
        <div className="">
            <ComponentToPrint ref={componentRef} />
        </div>
        
        <button className="btn btn-primary" onClick={handlePrint}>Print this out!</button>
      </div>
    );
  };

const PhotoGrid = () => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState); 
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);
    const [resImgToonify, setResImgToonify] = useState(null);
    const [resImgPixar, setResImgPixar] = useState(null);
    const [resImgSketch, setResImgSketch] = useState(null);
    const [resImgDisney, setResImgDisney] = useState(null);
    
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
                            {i === selectedImage.index && <div class="indicator-item badge badge-primary">✔ Selected</div> }
                            <img onClick={(e) => selectImage(e, i)} alt="" src={x} key={`img_gallery_${i}`} className="img rounded-md hover:grayscale cursor-pointer" />
                        </div>
                    ))
                }
                
            </div>

            <Link className="btn btn-error" to="/">Go back</Link>
            <div>
                <button className="btn btn-primary my-4" onClick={apiCall}>API Call</button>
            </div>

            <Example ></Example>

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