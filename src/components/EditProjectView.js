import React from "react";

import TopNavbar from './TopNavbar';
import EditPanel from './Edit/EditPanel';
import RenderPanel from './Render/RenderPanel';
import PrintPanel from './Print/PrintPanel';
import AnimatePanel from './Animate/AnimatePanel';
import UploadPanel from './Upload/UploadPanel';
import PlaytestPanel from './Playtest/PlaytestPanel';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import '../App.css';
import CreatePanel from "./Create/CreatePanel";

export default class EditProjectView extends React.Component {
  
    state = {
        currentRoute: "/"
    }
    
    getCurrentRoute() {
      var location = window.location.href
      return location.split("http://localhost:3000")[1]
    }
    componentDidMount() {
        this.setState({
            currentRoute: this.getCurrentRoute()
        })
    }
    updateRoute = (route) => {
        this.setState({currentRoute: route})
    }
    render() {
        const topNavbarItems = [
        {
            name:"Create",
            route:"/create"
        },
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
        return <BrowserRouter>
            <TopNavbar topNavbarItems={topNavbarItems} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
            <Routes>
            <Route path='/create' element={ <CreatePanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/' element={ <EditPanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/render' element={ <RenderPanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/print' element={ <PrintPanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/playtest' element={ <PlaytestPanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/upload' element={ <UploadPanel templativeProject={this.props.templativeProject}/> } />
            <Route path='/animate' element={ <AnimatePanel templativeProject={this.props.templativeProject}/> } />
            </Routes>
        </BrowserRouter>
        
    }
}