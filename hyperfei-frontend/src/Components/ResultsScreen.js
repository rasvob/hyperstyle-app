import { useReactToPrint } from 'react-to-print';
import QRCode  from "qrcode.react";
import { useState, useRef, forwardRef, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { postSelectedImage } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState, styleTransferedImagesState } from "../DAL/DataStore";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Instagram } from 'react-content-loader';

export const ComponentToPrint = forwardRef((props, ref) => {
    const [videoState] = useRecoilState(videoCaptureState);
    const [styleTransferedImages, setStyleTransferedImages] = useRecoilState(styleTransferedImagesState);

    return (
      <div ref={ref} className="flex flex-col h-screen">
        <div className="">
            <img src='460 FEI-CZ.png' className="w-2/3"></img>
        </div>
        <div className="flex-grow ">
            <div className="grid grid-cols-2 gap-6 justify-items-center container w-2/3 mx-auto">
                {
                    videoState.slice(0, 4).map((x, i) => (
                        <div className="border-b-4 border-vsb">
                            <img alt="" src={x} key={`img_gallery_${i}`} className="img" />
                        </div>
                    ))
                }
            </div>

            <div className="bg-vsb my-5">
                <div className="mx-auto w-2/3 py-3">
                    <h1 className="text-white text-4xl font-bold">Pojď studovat k nám!</h1>
                    <div className="flex-row flex">
                        <div className="flex-1 mr-3">
                            <p className="font-sans text-white text-sm text-opacity-80 my-3">Náš svět se skládá z jedniček a nul. Jednotvárný ale není, neboj. Každý den je jiný. Každá aplikace, každý web nebo operační systém si hodinu od hodiny žádají nové nápady.</p>
                            <p className="font-sans text-white text-sm text-opacity-80 my-3">Mezi „softwary, hardwary, bity i byty“ jsme jako ryby ve vodě. A pokud je i tobě v tomhle světě dobře, u nás se určitě neztratíš. Naopak. Jestli toužíš po studiu, které má smysl, jsi na správné adrese.</p>
                        </div>
                        <div className="flex items-center">
                            <QRCode value="https://www.studujvostrave.cz/studijni-obory/informatika/" size={156}></QRCode>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-2/3 flex justify-center">
                    <h1 className="font-sans bg-white color-vsb text-xl font-bold uppercase p-3 mb-3">Nascanuj QR kód a dozvi se více!</h1>
                </div>
            </div>
        </div>
        
        <div className="ml-6 mb-4">
            <img src='pdf_footer.png' className="w-2/3" alt="print-footer" />
        </div>
      </div>
    );
  });

const PrintButton = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
      <div>
        <div className="hidden">
            <ComponentToPrint ref={componentRef} />
        </div>
        
        <button className="btn btn-primary" onClick={handlePrint}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        </button>
      </div>
    );
  };

const ImageResultComponent = ({image, title}) => {
    return (
        <div>
            <div className="indicator">
            <div className="indicator-item badge badge-primary">{title}</div>

            {
                image 
                ? <img className='img rounded-md' alt='Image after style transfer' src={image} /> 
                : <Instagram width={372} height={372} />
            }
            </div>
        </div>
    );
};

export default function ResultsScreen() {
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);
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
            if (error.cause === 'Face') {
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
            
            <div className='flex justify-between gap-6'>
                <div>
                <button onClick={goBack} className='btn btn-accent'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                </div>
                <div className='flex flex-row gap-3'>
                <Link className='btn btn-warning gap-2' to='/capture'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Start over
                </Link>
                <PrintButton />
                </div>
            </div>
        </div>
    );
}