import './App.css';

import TopNavbar from './components/TopNavbar';
import MainBody from './components/MainBody';

function App() {
  const topNavbarItems = [
    {
      name:"Edit",
      callback: ()=>{}
    },
    {
      name:"Render",
      callback: ()=>{}
    },
    {
      name:"Print",
      callback: ()=>{}
    },
    {
      name:"Playtest",
      callback: ()=>{}
    },
    {
      name:"Upload",
      callback: ()=>{}
    },
    {
      name:"Animate",
      callback: ()=>{}
    }
  ]
  return (
    <div className="App">
      <div className="container-fluid">
        <TopNavbar topNavbarItems={topNavbarItems}/>
        <MainBody/>
      </div>
    </div>
  );
}

export default App;
