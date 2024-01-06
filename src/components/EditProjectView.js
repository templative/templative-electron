import React from "react";

import TopNavbar from './TopNavbar';
import EditPanel from './Edit/EditPanel';
import RenderPanel from './Render/RenderPanel';
import PrintPanel from './Print/PrintPanel';
import AnimatePanel from './Animate/AnimatePanel';
import UploadPanel from './Upload/UploadPanel';
import PlanPanel from './Plan/PlanPanel';
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
        // {
        //     name:"Plan",
        //     route:"/plan"
        // },
        // {
        //     name:"Prototype",
        //     route:"/create"
        // },
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
        // {ß
        //     name:"Market",
        //     route:"/market"
        // },
        // {
        //     name:"Attend",
        //     route:"/market"
        // }
        ]
        return <BrowserRouter>
            <TopNavbar topNavbarItems={topNavbarItems} currentRoute={this.state.currentRoute} updateRouteCallback={this.updateRoute}/>
            <Routes>
            <Route path='/plan' element={ <PlanPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/create' element={ <CreatePanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/' element={ <EditPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/render' element={ <RenderPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/print' element={ <PrintPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/playtest' element={ <PlaytestPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/upload' element={ <UploadPanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            <Route path='/animate' element={ <AnimatePanel templativeRootDirectoryPath={this.props.templativeRootDirectoryPath}/> } />
            </Routes>
        </BrowserRouter>
        
    }
}