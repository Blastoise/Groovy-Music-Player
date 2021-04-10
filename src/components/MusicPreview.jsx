import React from "react";
import "./MusicPreview.css";

const MusicPreview = (props) => {
  return (
    <div>
      <div className="song-info-container">
        <div className="preview-img-info-group" onClick={props.changePage}>
          <img
            className="preview-art"
            src={`data:jpeg;base64,${props.img}`}
            alt=""
          />
          <div className="preview-song-info">
            <h1>{props.title}</h1>
            <h2>{props.artist}</h2>
          </div>
        </div>
        <div className="preview-container-song">
          <div className="preview-music-controls">
            <img
              src="./backward.svg"
              alt=""
              className="preview-prev-button"
              onClick={props.prevSong}
            />
            <img
              src={props.play === true ? "./pause.svg" : "./play.svg"}
              alt=""
              className="preview-play-button"
              onClick={props.playPauseHandler}
            />
            <img
              src="./forward.svg"
              alt=""
              className="preview-next-button"
              onClick={props.nextSong}
            />
            <img
              src="./shuffle.svg"
              alt=""
              className="preview-shuffle-button"
              onClick={props.handleShuffle}
            />
            <img
              src="./repeat.svg"
              alt=""
              onClick={props.repeatSong}
              className="preview-repeat-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPreview;
