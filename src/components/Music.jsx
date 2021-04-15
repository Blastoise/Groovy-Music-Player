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
            <div>
              <img
                src="./backward.svg"
                alt=""
                className="prev-button"
                onClick={props.prevSong}
              />
            </div>
            <div>
              <img
                src={props.play === true ? "./pause.svg" : "./play.svg"}
                alt=""
                className="play-button"
                onClick={props.playPauseHandler}
              />
            </div>
            <div>
              <img
                src="./forward.svg"
                alt=""
                className="next-button"
                onClick={props.nextSong}
              />
            </div>
            <div className={props.shuffle ? "shuffle-on" : "shuffle-off"}>
              <img
                src="./shuffle.svg"
                alt=""
                className="shuffle-button"
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
                className="repeat-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
