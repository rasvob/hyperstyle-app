import { useLocation } from "react-router-dom";

export default function Footer() {
    const {pathname} = useLocation();

    return (
        <footer className={`p-4 footer ${pathname === '/' ? "bg-transparent text-gray-100 fixed bottom-0" : 'bg-base-300 text-base-content'}  footer-center`}>
        <div>
            <p>Created by <a href='https://github.com/rasvob' rel="noreferrer" target="_blank" className={`link ${pathname === '/' ? '' : 'link-secondary'}`}>Radek Svoboda</a> with React, FastAPI and PyTorch ✌️ <br/>Have you found a bug? Feel free to <a className={`link ${pathname === '/' ? '' : 'link-secondary'}`} href='mailto:radek.svoboda@vsb.cz?subject=HyperFace Bug'>contact me</a>!</p>
        </div>
        </footer>
    );
}