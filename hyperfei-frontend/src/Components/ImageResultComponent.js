import { Instagram } from 'react-content-loader';

const ImageResultComponent = ({image, title}) => {
    return (
        <div>
            <div className="indicator">
            <div className="indicator-item badge indicator-center badge-primary">{title}</div>

            {
                image 
                ? <img className='img rounded-md' alt='Image after style transfer' src={image} /> 
                : <Instagram width={372} height={372} />
            }
            </div>
        </div>
    );
};

export default ImageResultComponent;