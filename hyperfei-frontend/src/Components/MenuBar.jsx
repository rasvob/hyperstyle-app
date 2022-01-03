
export const MenuBar = () => {
    return (
    <div className="navbar mb-2 bg-gray-100 text-neutral-content">
        <div className="flex-1 px-2 mx-2">
            <span className="text-3xl font-bold text-primary">
                HyperFace
            </span>
        </div> 
        <div className="flex-none">
            <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current text-error">   
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
            </svg>
            </button>
        </div>
    </div>
    );
};