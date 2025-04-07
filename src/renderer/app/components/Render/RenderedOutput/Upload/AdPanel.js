import React from "react";
import "./AdPanel.css"
import GameContentIcon from "../../../Edit/Icons/gameIcon.svg?react"
const {shell} = require('electron')
const path = require("path")
const { ipcRenderer } = require('electron');
import { channels } from "../../../../../../shared/constants"
import { addSpaces } from "../../../../utility/addSpaces"

export default class AdPanel extends React.Component {
    render() {
        const imagePath = `${this.props.templativeRootDirectoryPath}/gamecrafter`;
        const images = {
            backdrop: `file://${imagePath}/backdrop.png`,
            advertisement: `file://${imagePath}/advertisement.png`,
            actionShot: `file://${imagePath}/actionShot.png`,
            logo: `file://${imagePath}/logo.png`
        };
        const nameUsed = this.props.isPublish ? this.props.game.name : path.basename(this.props.selectedOutputDirectory);

        var componentElements = this.props.uploadComponents
            .filter(component => {
                return !component.type.startsWith("STOCK_") || this.props.isIncludingStock;
            })
            .map((component, index) => {
                var isStock = component.type.startsWith("STOCK_");
                var prettyType = addSpaces(isStock ? component.type.replace("STOCK_", "") : component.type)
                if (isStock) {
                    return <tr key={`${component.name}-${index}`}>
                        <td>{prettyType}</td>
                        <td>{component.quantity} {prettyType}({component.quantity > 1 ? "s" : ""})</td>
                    </tr>
                }
                var pieceQuantity = 1;
                if (component.frontInstructions) {
                    pieceQuantity = component.frontInstructions.reduce((total, instruction) => {
                        return total + (instruction.quantity || 0);
                    }, 0);
                }
                return <tr key={`${component.name}-${index}`}>
                    <td>{prettyType}</td>
                    <td>{component.quantity} component{component.quantity > 1 ? "s" : ""} of {pieceQuantity} piece{pieceQuantity > 1 ? "s" : ""}</td>
                    <td>
                        {component.backInstructions &&
                            <img src={`file://${component.backInstructions["filepath"]}`} alt={`${component.name} component`} className="img-fluid" />
                        }
                    </td>
                </tr>
            })
        return (
            <div className="gamecrafter-preview-container" data-bs-theme="dark">
                <div className="preview-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Store Page Preview</h4>
                    <div className="d-flex gap-2">
                        {this.props.gameCrafterUrl && 
                            <button onClick={() => AdPanel.visitLink(this.props.gameCrafterUrl)} className="btn btn-sm the-gamecrafter-url-button">
                                Edit Components <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                                </svg>
                        </button>
                        }
                        <button onClick={this.props.editGameJsonCallback} className="btn btn-sm btn-dark d-flex align-items-center gap-2 nowrap">
                            Edit Game Content <GameContentIcon alt="Game Content Icon" width="16" height="16" />
                        </button>
                        <button onClick={this.props.openFolder} className="btn btn-sm btn-dark">
                            Open Store Page Images Folder <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="store-preview">
                    <div className="row">
                        <div className="col">
                            <div className="backdrop-wrapper position-relative">
                                <img src={images.backdrop} className="img-fluid main-preview-image" alt="Game backdrop"/>
                                <img src={images.logo} className="preview-thumbnail logo-overlay" alt="Logo"/>
                            </div>
                        </div>
                    </div>
                    <div className="row url-row">
                        <div className="col">
                            <p className="mb-0">Games / {this.props.game.category} / {nameUsed}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <h2>{nameUsed} </h2>
                            <p className="lead">{this.props.game.shortDescription}</p>
                            <h3>Requirements</h3>
                            <div className="game-details">
                                <div className="detail-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                    </svg>
                                    <span>{this.props.game.playTime}</span>
                                </div>
                                <div className="detail-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                        <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                        <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                    </svg>
                                    <span>{this.props.game.minPlayers}-{this.props.game.maxPlayers} Players</span>
                                </div>
                                
                                <div className="detail-badge">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                        <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/>
                                    </svg>
                                    <span>Ages {this.props.game.minAge}</span>
                                </div>
                            </div>
                            <h3>Description</h3>
                            <p>{this.props.game.longDescription}</p>
                            <h3>Components</h3>
                            <div className="components-container">
                                <table className="table table-dark components-table">
                                    <thead className="components-table-head">
                                        <tr>
                                            <th>Component</th>
                                            <th>Quantity</th>
                                            <th>Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="components-table-body">
                                        {componentElements}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="cool-factors mt-3">
                                <h5>Why buy this?</h5>
                                <ul className="list-unstyled">
                                    {this.props.game.coolFactors.map((factor, index) => (
                                        <li key={index} className="cool-factor-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                                            </svg> {factor}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <h3 className="text-center">See it in Action</h3>
                            <img src={images.actionShot} className="preview-thumbnail see-it-in-action-image" alt="Action shot"/>
                        </div>
                        <div className="col-12 col-md-6">
                            <h3 className="text-center">Advertisement</h3>
                            <div className="advertisement-container">
                                <img src={images.advertisement} className="" alt="Advertisement"/>
                                <p className="advertisement-title">{nameUsed}</p>
                                <button disabled={this.props.gameCrafterUrl === undefined} onClick={() => AdPanel.visitLink(this.props.gameCrafterUrl)} className="btn btn-sm the-gamecrafter-url-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg> Go to Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static visitLink = async (link) => {
        await ipcRenderer.invoke(channels.TO_SERVER_OPEN_URL, link)
    }
}