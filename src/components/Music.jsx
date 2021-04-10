import React from "react";

const Music = (props) => {
  return (
    <div>
      <img
        src="./back-left-arrow-square-button-outline.svg"
        alt=""
        className="back-button"
        onClick={props.changePage}
      />
      <div className="main">
        <div className="background-img" style={props.styleObject()}></div>
        <div className="main_div">
          <div className="music-container">
            <img
              src={
                !props.imageBuffer
                  ? props.image
                  : `data:jpeg;base64,${props.imageBuffer}`
              }
              alt=""
            />
            <div className="music-info">
              <h1>{props.title}</h1>
              <h2>{props.artist}</h2>
            </div>
          </div>
          <div className="music-controls">
            <img
              src="./backward.svg"
              alt=""
              className="prev-button"
              onClick={props.prevSong}
            />
            <img
              src={props.play === true ? "./pause.svg" : "./play.svg"}
              alt=""
              className="play-button"
              onClick={props.playPauseHandler}
            />
            <img
              src="./forward.svg"
              alt=""
              className="next-button"
              onClick={props.nextSong}
            />
            <img
              src="./shuffle.svg"
              alt=""
              className="shuffle-button"
              onClick={props.handleShuffle}
            />
            <img
              src="./repeat.svg"
              alt=""
              onClick={props.repeatSong}
              className="repeat-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
