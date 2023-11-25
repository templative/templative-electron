import './App.css';
import TemplativeButton from './components/TemplativeButton';
import TemplativeProjectRenderer from "./components/TemplativeProjectRenderer"

function App() {

  return (
    <div className="App">
      <div className="container-fluid">
        <div className='row'>
          <div className='col'>
            <TemplativeProjectRenderer/>
          </div>
          <div className='col'>
            
          </div>
          <div className='col'>
            <TemplativeButton/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
