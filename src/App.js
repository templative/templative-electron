import React from "react";

import TopNavbar from './components/TopNavbar';
import EditPanel from './components/Edit/EditPanel';
import RenderPanel from './components/Render/RenderPanel';
import PrintPanel from './components/Print/PrintPanel';
import AnimatePanel from './components/Animate/AnimatePanel';
import UploadPanel from './components/Upload/UploadPanel';
import PlaytestPanel from './components/Playtest/PlaytestPanel';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

import './App.css';

class App extends React.Component {
  
  state = {
    currentRoute: "/"
  }
  componentDidMount() {
    var location = window.location.href
    this.setState({ currentRoute: location.split("http://localhost:3000")[1]})
  }
  updateRoute = (route) => {
    this.setState({currentRoute: route})
  }
  render() {
    const topNavbarItems = [
      {
        name:"Edit",
        route:"/"
      },
      {
        name:"Render",
        route:"/render"
      },
      {
        name:"Print",
        route:"/print"
      },
      {
        name:"Playtest",
        route:"/playtest"
      },
      {
        name:"Upload",
        route:"/upload"
        
      },
      {
        name:"Animate",
        route:"/animate"
      }
    ]
    
    return (
      <div className="App">
        <div className="container-fluid">
          <BrowserRouter>
            <TopNavbar topNavbarItems={topNavbarItems} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
            <Routes>
              <Route path='/' element={ <EditPanel/> } />
              <Route path='/render' element={ <RenderPanel/> } />
              <Route path='/print' element={ <PrintPanel/> } />
              <Route path='/playtest' element={ <PlaytestPanel/> } />
              <Route path='/upload' element={ <UploadPanel/> } />
              <Route path='/animate' element={ <AnimatePanel/> } />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
