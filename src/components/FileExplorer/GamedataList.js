import React from "react";
// import "./Artdata.css"
const path = window.require("path");

export default class GamedataList extends React.Component {   
    render() {
        var divs = [];
        for(var i = 0; i < this.props.gamedataFilenames.length; i++) {
            divs.push(
                <div className="gamedataItemWrapper" key={this.props.gamedataFilenames[i]}>
                    <p className="gamedataItem">{path.parse(this.props.gamedataFilenames[i]).name}</p>
                </div>
            )
        }
        return <div className="gamedata">
            <div className="gamedataItemWrapper" key="game">
                <p className="gamedataItem">Studio</p>
            </div>
            <div className="gamedataItemWrapper" key="game">
                <p className="gamedataItem">Game</p>
            </div>
            {divs}
        </div> 
    }
}