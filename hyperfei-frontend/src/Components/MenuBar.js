import { videoCaptureState } from "../DAL/DataStore";
import { useRecoilState } from "recoil";
import { Link, useLocation } from "react-router-dom";

export const MenuBar = () => {
    const [videoState, setVideoCaptureState] = useRecoilState(videoCaptureState);
    const {pathname} = useLocation();

    if (pathname === '/') {
        return null;
    }

    return (
    <div>
        <header className="z-50 navbar w-full bg-white px-7 fixed text-base-content flex justify-between items-center">
                <div className="inline-block mb-1">
                    <Link to='/'>
                    <span className="text-3xl text-primary font-semibold">
                        hyper
                    </span>

                    <span className="text-3xl text-base-content font-bold">
                        Face
                    </span>
                    </Link>
                </div>
                
                <p className="font-mono opacity-40">v1.0.0</p>
        </header>

        <div className="hero h-44 bg-gradient-to-br from-primary to-secondary text-primary-content">
            AAAA
        </div>
    </div>
    );
};