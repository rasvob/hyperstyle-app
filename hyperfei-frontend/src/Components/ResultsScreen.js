import { useReactToPrint } from 'react-to-print';
import { useState, useRef, forwardRef, useEffect } from "react";
import { useRecoilCallback, useRecoilState, useResetRecoilState } from "recoil";
import { postSelectedImage } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState, styleTransferedImagesState, selectedPrintStyleState } from "../DAL/DataStore";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import ComponentToPrint from './ComponentToPrint';
import ImageResultComponent from "./ImageResultComponent";

const PrintButton = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    const [selectedPrintMode, setSelectedPrintMode] = useState(null);
    const [styleTransferedImages, ] = useRecoilState(styleTransferedImagesState);

    const areImagesAvailable = () => {
        return styleTransferedImages.Pixar !== null;
    };

    const printPage = (e, mode) => {
        e.preventDefault();
        setSelectedPrintMode(mode);
    };

    useEffect(() => {
        if (selectedPrintMode === null) {
            return;
        }

        handlePrint();
    }, [selectedPrintMode]);

    return (
      <div>
        <div className="hidden">
            <ComponentToPrint ref={componentRef} mode={selectedPrintMode}/>
        </div>
        
        <div className={`dropdown dropdown-left dropdown-start ${areImagesAvailable() ? 'dropdown-hover' : ''}`}>
        <button className="btn btn-primary" disabled={areImagesAvailable()  ? '' : 'disabled'} tabIndex="0" onClick={(e) => printPage(e, 'NO_ORIGINAL')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        </button>
        <ul tabIndex="0" className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-60">
        <li>
            <a href="blan.k" role="menuitem" onClick={(e) => printPage(e, 'NO_SKETCH')}>w/o sketch</a>
            <a href="blan.k" role="menuitem" onClick={(e) => printPage(e, 'NO_DISNEY')}>w/o disney</a>
        </li> 
        </ul>
        </div>
      </div>
    );
  };



export default function ResultsScreen() {
    const [selectedImage, ] = useRecoilState(selectedImageState);
    const [styleTransferedImages, setStyleTransferedImages] = useRecoilState(styleTransferedImagesState);
    const resetStyleTransferedImages = useResetRecoilState(styleTransferedImagesState);
    const navigate = useNavigate();

    

    const apiCall = async () => {
        try {
            const res = await postSelectedImage(selectedImage.data);

            setStyleTransferedImages({
                Toonify: res['GeneratorTypes.TOONIFY'],
                Pixar: res['GeneratorTypes.PIXAR'],
                Sketch: res['GeneratorTypes.SKETCH'],
                Disney: res['GeneratorTypes.DISNEY_PRINCESS'],
            });
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) {
                toast.error('Whoops! It seems that the REST API is down. Admin needed 😢');
            }
            else if (error.cause === 'Face') {
                toast.error('Whoops! We are unable to detect face, please try again 😢');
            } else if (error.cause === 'Server') {
                toast.error('Whoops! Bad response from server. This is bad. Admin needed 😢');
            }
        }
    };

    const goBack = (e) => {
        e.preventDefault();
        resetStyleTransferedImages();
        navigate('/photos');
    };

    useEffect(() => {
        if (!selectedImage.data) {
            toast.error('Hey something is wrong. Make sure that a proper image is selected.');
            navigate('/photos');
        }

        if (!styleTransferedImages.Toonify) {
            toast('Running our mojo...wait a bit ⌛');
            apiCall();
        }
    }, []);

    

    return (
        <div className='container mx-auto mb-6 mt-6'>
            <div className='grid grid-cols-8 mb-6'>
                <div className='col-start-4 col-span-2'>
                    <ImageResultComponent image={selectedImage.data} title="Original" />
                </div>
            </div>
            
            <div className='grid grid-cols-4 gap-4 mb-4'>
                <ImageResultComponent image={styleTransferedImages.Pixar} title="Pixar" />
                <ImageResultComponent image={styleTransferedImages.Toonify} title="Toonify" />
                <ImageResultComponent image={styleTransferedImages.Sketch} title="Sketch"/>
                <ImageResultComponent image={styleTransferedImages.Disney} title="Disney" />
            </div>
            
            <div className='flex justify-between'>
                <div className='gap-6 flex'>
                    <button onClick={goBack} className='btn btn-accent'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    </button>

                    <Link className='btn btn-warning gap-2' to='/capture'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Start over
                    </Link>
                </div>
                <div className=''>
                <PrintButton />
                </div>
            </div>
        </div>
    );
}