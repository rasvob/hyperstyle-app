import { useRecoilState } from "recoil";
import { videoCaptureState, styleTransferedImagesState } from "../DAL/DataStore";
import QRCode  from "qrcode.react";
import { forwardRef } from "react";
import { selectedImageState, selectedPrintStyleState } from "../DAL/DataStore";

const ImagePrint = ({source, title}) => {
    return (
        <div className="indicator">
            <div className="indicator-item badge indicator-center badge-primary bg-vsb border-vsb">{title}</div>
            <div className="border-b-4 border-vsb">
                <img alt="" src={source} className="img" />
            </div>
        </div>
    );
}

const ComponentToPrint = forwardRef((props, ref) => {
    const [styleTransferedImages, setStyleTransferedImages] = useRecoilState(styleTransferedImagesState);
    const [selectedImage, setSelectedImage] = useRecoilState(selectedImageState);

    return (
      <div ref={ref} className="flex flex-col h-screen">
        <div className="">
            <img src='460 FEI-CZ.png' className="w-2/3"></img>
        </div>
        <div className="flex-grow ">
            <div className="grid grid-cols-2 gap-6 justify-items-center container w-2/3 mx-auto">
                {/* <div className="border-b-4 border-vsb">
                    <img alt="" src={styleTransferedImages.Pixar} className="img" />
                </div>

                <div className="border-b-4 border-vsb">
                    <img alt="" src={styleTransferedImages.Toonify} className="img" />    
                </div>

                <div className="border-b-4 border-vsb">
                    <img alt="" src={styleTransferedImages.Sketch} className="img" />
                </div>

                <div className="border-b-4 border-vsb">
                    <img alt="" src={styleTransferedImages.Disney} className="img" />
                </div> */}

                {props.mode === 'NO_ORIGINAL' &&
                    <>
                    <ImagePrint source={styleTransferedImages.Pixar} title={'Pixar'} />
                    <ImagePrint source={styleTransferedImages.Toonify} title={'Toonify'} />
                    <ImagePrint source={styleTransferedImages.Sketch} title={'Sketch'} />
                    <ImagePrint source={styleTransferedImages.Disney} title={'Disney'} />
                    </>
                }

                {props.mode === 'NO_SKETCH' &&
                    <>
                    <ImagePrint source={selectedImage.data} title={'Original'} />
                    <ImagePrint source={styleTransferedImages.Pixar} title={'Pixar'} />
                    <ImagePrint source={styleTransferedImages.Toonify} title={'Toonify'} />
                    <ImagePrint source={styleTransferedImages.Disney} title={'Disney'} />
                    </>
                }

                {props.mode === 'NO_DISNEY' &&
                    <>
                    <ImagePrint source={selectedImage.data} title={'Original'} />
                    <ImagePrint source={styleTransferedImages.Pixar} title={'Pixar'} />
                    <ImagePrint source={styleTransferedImages.Toonify} title={'Toonify'} />
                    <ImagePrint source={styleTransferedImages.Sketch} title={'Sketch'} />
                    </>
                }

                {/* <>
                <ImagePrint source={selectedImage.data} title={'Original'} />
                <ImagePrint source={styleTransferedImages.Pixar} title={'Pixar'} />
                <ImagePrint source={styleTransferedImages.Toonify} title={'Toonify'} />
                <ImagePrint source={styleTransferedImages.Sketch} title={'Sketch'} />
                </> */}
            </div>

            <div className="bg-vsb my-5">
                <div className="mx-auto w-2/3 py-3">
                    <h1 className="text-white text-2xl font-bold text-center">Jdi vstříc budoucnosti, studuj informatiku!</h1>
                    <div className="flex-row flex">
                        <div className="flex-1 mr-3">
                            <p className="font-sans font-bold text-white text-sm text-opacity-80 my-3">Svět jedniček a nul tvoří zítřek. Hodinu od hodiny jsou potřeba nové nápady, které posunou aplikace, weby, hry i celé systémy na další level. Jsi připraven překonávat hranice?</p>
                            <p className="font-sans font-bold text-white text-sm text-opacity-80 my-3">Software, hardware, bity i bajty, to je naše. Máš to stejně? Tak je to jasné, pro informatiku už dávno žiješ. Začni u nás studovat a posuň svoje skills na další level. Studuj IT v Ostravě, v srdci techniky.</p>
                        </div>
                        <div className="flex items-center">
                            {/* <QRCode value="https://www.studujvostrave.cz/studijni-obory/informatika/" size={156}></QRCode> */}
                            <img src='6CIja8x-qrcode.png' width="156" height="156"></img>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-2/3 flex justify-center">
                    <h1 className="font-sans bg-white color-vsb text-lg font-bold uppercase p-3 mb-3">NASCANUJ QR KÓD A SLEDUJ NÁS NA INSTAGRAMU!</h1>
                </div>
            </div>
        </div>
        
        <div className="ml-6 mb-4">
            <img src='pdf_footer_v2.png' className="w-2/3" alt="print-footer" />
        </div>
      </div>
    );
  });

export default ComponentToPrint;