import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export const MenuBar = () => {
    const {pathname} = useLocation();
    const [progressStep, setProgressStep] = useState(0);

    useEffect(() => {
        switch (pathname) {
            case '/capture':
                setProgressStep(0);
                break;
            case '/photos':
                setProgressStep(1);
                break;
            case '/results':
                setProgressStep(2);
                break;
            default:
                setProgressStep(0);
        }
    }, [pathname])

    if (pathname === '/') {
        return null;
    }

    return (
    <div>
        <header className="navbar w-full bg-white px-7 text-base-content flex justify-between items-center">
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

        <div className="h-40 bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center">
            <div className="card bg-white text-primary-content mx-auto container">
                <div className="card-body text-black">
                <ul className="w-full steps">
                    <li className={`step ${progressStep >= 0 ? 'step-primary' : ''}`}>Take a few selfies</li> 
                    <li className={`step ${progressStep >= 1 ? 'step-primary' : ''}`}>Select desired selfie</li> 
                    <li className={`step ${progressStep >= 2 ? 'step-primary' : ''}`}>View the results 😊</li> 
                </ul>
                </div>
            </div> 
        </div>
    </div>
    );
};