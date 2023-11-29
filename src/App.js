import React from "react";

import TopNavbar from './components/TopNavbar';
import EditPanel from './components/Edit/EditPanel';
import RenderPanel from './components/Render/RenderPanel';
import PrintPanel from './components/Print/PrintPanel';
import AnimatePanel from './components/Animate/AnimatePanel';
import UploadPanel from './components/Upload/UploadPanel';
import PlaytestPanel from './components/Playtest/PlaytestPanel';
import { channels } from './shared/constants';
import TemplativeProject from "./components/TemplativeProject"
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  
    state = {
        currentRoute: "/",
        templativeProject: undefined
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners(channels.GIVE_TEMPLATIVE_ROOT_FOLDER);
    }

    getCurrentRoute() {
      var location = window.location.href
      return location.split("http://localhost:3000")[1]
    }
    componentDidMount() {
        this.renderer = ipcRenderer.on(channels.GIVE_TEMPLATIVE_ROOT_FOLDER, (event, templativeRootDirectoryPath) => {
            var templativeProject = new TemplativeProject(templativeRootDirectoryPath)
            this.setState({templativeProject: templativeProject})
        });
        var templativeProject = new TemplativeProject("C:/Users/User/Documents/git/nextdaygames/apcw-defines");
        
        this.setState({
            templativeProject: templativeProject, 
            currentRoute: this.getCurrentRoute()
        })
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
        },
        {
            name:"Market",
            route:"/market"
        }
        ]
        
        return (
        <div className="App">
            <div className="container-fluid">
            <BrowserRouter>
                <TopNavbar topNavbarItems={topNavbarItems} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
                <Routes>
                <Route path='/' element={ <EditPanel templativeProject={this.state.templativeProject}/> } />
                <Route path='/render' element={ <RenderPanel templativeProject={this.state.templativeProject}/> } />
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
