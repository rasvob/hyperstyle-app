import { Link } from "react-router-dom";

export default function HeroPage() {
    return (
        <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
            <div className="text-center hero-content text-neutral-content">
                <div className="">
                    <h1 className="mb-5 text-7xl font-bold animate__animated animate__zoomInLeft animate__slow">
                            hyperFace
                    </h1> 
                    <div className="animate__animated animate__zoomInRight animate__slow">
                        <p className="">
                            Have you ever wondered how would you look like in Pixar or Disney movies? No? Really? Really?! <br/> Who are you trying to trick? <span className="font-bold">Of course you have!</span>
                        </p> 

                        <p> And here comes the Hyperstyle app for a resque because <span className="font-light">*surprise*</span> it let's you to do exactly this.</p>

                        <p>Hyperstyle is an app which utilizes deep learning techniques for the <span className="font-bold">style-transfer</span> of a <span className="font-bold">selfie</span> photos.</p>

                        <Link to='/capture' className="btn btn-primary mt-6 animate__animated animate__pulse animate__slow animate__infinite animate__delay-2s">Let's try it out!</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}