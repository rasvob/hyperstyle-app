import './App.css';
import { MenuBar } from "./Components/MenuBar";

function App() {
  return (
    <div data-theme='emerald'>
        <MenuBar />
        <div class="hero min-h-screen bg-base-200">
        <div class="text-center hero-content">
          <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold text-primary">
                  Hello there
                </h1> 
            <p class="mb-5">
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p> 
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    <div className='container mx-auto'>

          <h1 className="text-3xl">
            Hello world!
          </h1>

          <br />
          <button className="btn btn-primary">daisyUI Button</button>
          
        </div>
      </div>
  );
}

export default App;
