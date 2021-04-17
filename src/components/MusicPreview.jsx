import React from "react";
import "./MusicPreview.css";

const MusicPreview = (props) => {
  return (
    <div>
      <div className="song-info-container">
        <div className="preview-img-info-group" onClick={props.changePage}>
          <img
            className="preview-art"
            src={!props.img ? props.image : `data:jpeg;base64,${props.img}`}
            alt=""
          />
          <div className="preview-song-info">
            <h1>{props.title}</h1>
            <h2>{props.artist}</h2>
          </div>
        </div>
        <div className="preview-container-song">
          <div className="preview-music-controls">
            <div>
              <img
                src="./backward.svg"
                alt=""
                className="preview-prev-button"
                onClick={props.prevSong}
              />
            </div>

            <div>
              <img
                src={props.play === true ? "./pause.svg" : "./play.svg"}
                alt=""
                className="preview-play-button"
                onClick={props.playPauseHandler}
              />
            </div>
            <div>
              <img
                src="./forward.svg"
                alt=""
                className="preview-next-button"
                onClick={props.nextSong}
              />
            </div>
            <div className={props.shuffle ? "shuffle-on" : "shuffle-off"}>
              <img
                src="./shuffle.svg"
                alt=""
                className="preview-shuffle-button"
                onClick={props.handleShuffle}
              />
            </div>
            <div className={props.loop === 2 ? "loop-on" : "loop-off"}>
              <img
                src={
                  props.loop === 1
                    ? "./repeat_one_48px.svg"
                    : "./repeat_48px.svg"
                }
                alt=""
                onClick={props.repeatSong}
                className="preview-repeat-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPreview;
