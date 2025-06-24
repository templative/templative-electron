import YouTube from 'react-youtube';
import './YoutubeVideos.css';
import React, { useState, useEffect } from 'react';

const YoutubeBase = ({ videoId, type }) => {
    const [showVideo, setShowVideo] = useState(false);
    
    const handleThumbnailClick = () => {
        setShowVideo(true);
    }

    return (
        <div className={`youtube-container ${type} mb-2`}>
            {!showVideo ? (
                <div 
                    className="youtube-thumbnail" 
                    onClick={handleThumbnailClick}
                    style={{
                        backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
                        cursor: 'pointer',
                    }}
                >
                    <div className="play-button"></div>
                </div>
            ) : (
                <YouTube 
                    key={videoId}
                    videoId={videoId} 
                    opts={{
                        height: '100%', 
                        width: '100%', 
                        playerVars: {
                            autoplay: 1
                        }
                    }} 
                />
            )}
        </div>
    );
}

export const YoutubeLong = ({ videoId }) => {
    return <YoutubeBase videoId={videoId} type="long" />;
}

export const YoutubeShort = ({ videoId }) => {
    console.log('Rendering YouTube short with ID:', videoId);
    return <YoutubeBase videoId={videoId} type="short" />;
}
