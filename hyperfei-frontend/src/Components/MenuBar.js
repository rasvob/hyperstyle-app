import { videoCaptureState } from "../DAL/DataStore";
import { useRecoilState } from "recoil";


export const MenuBar = () => {
    const [videoState, setVideoCaptureState] = useRecoilState(videoCaptureState);

    return (
    <header className="z-50 navbar w-full bg-white px-7 text-primary-content fixed text-base-content flex justify-between items-center">
            <div className="inline-block mb-1">
                <span className="text-3xl text-primary font-semibold">
                    hyper
                </span>

                <span className="text-3xl text-base-content font-bold">
                    Face
                </span>

                <span>{videoState.length}</span>
            </div>
            
            <p className="font-mono opacity-40">v1.0.0</p>
    </header>
    );
};