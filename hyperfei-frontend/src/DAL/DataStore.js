import { atom } from "recoil";

export const videoCaptureState = atom({
    key: 'videoCaptureState',
    default: []
});

export const framesCapturedState = atom({
    key: 'framesCapturedState', 
    default: 0
});

export const selectedImageState = atom({
    key: 'selectedImageState', 
    default: {
        index: 0,
        data: null
    }
});
