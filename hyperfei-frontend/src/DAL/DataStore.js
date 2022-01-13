import { atom } from "recoil";

export const videoCaptureState = atom({
    key: 'videoCaptureState',
    default: []
});

export const framesCapturedState = atom({
    key: 'framesCapturedState', 
    default: 0
});

export const lastSelectedWebcamState = atom({
    key: 'lastSelectedWebcamState', 
    default: null
});

export const selectedImageState = atom({
    key: 'selectedImageState', 
    default: {
        index: null,
        data: null
    }
});

export const styleTransferedImagesState = atom({
    key: 'styleTransferedImagesState', 
    default: {
        Toonify: null,
        Pixar: null,
        Sketch: null,
        Disney: null,
    }
});

export const selectedPrintStyleState = atom({
    key: 'selectedPrintStyleState', 
    default: 'NO_ORIGINAL'
});
