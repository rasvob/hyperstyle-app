import ReactToPrint, { useReactToPrint } from 'react-to-print';
import QRCode  from "qrcode.react";
import { useState, useRef, forwardRef } from "react";
import { useRecoilState } from "recoil";
import { getActiveRoute, postSelectedImage, postSelectedImageFake, postSelectedImageFail } from "../DAL/APIGateway";
import { videoCaptureState, selectedImageState } from "../DAL/DataStore";

export const ComponentToPrint = forwardRef((props, ref) => {
    const [videoState, setVideoState] = useRecoilState(videoCaptureState);

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

const Example = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
      <div>
        <div className="hidden">
            <ComponentToPrint ref={componentRef} />
        </div>
        
        <button className="btn btn-primary" onClick={handlePrint}>Print this out!</button>
      </div>
    );
  };

export default function ResultsScreen() {
    return (
        
        <>
        <p>AAAA</p>
        <Example></Example>
        </>

    );
}