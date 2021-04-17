import React from "react";
import MusicPreview from "./MusicPreview";
import "./Home.css";

const Home = (props) => {
  return (
    <div className="home-container">
      <h1 className="home-head">My Music</h1>
      <div className="home-sections">
        <h2 className="head-active">Songs</h2>

        <h2>Albums</h2>
      </div>

      <div className="head-flex-column">
        {props.data.map((element, index) => {
          let classString;
          if (props.counter === index) {
            classString = "rowing current-play";
          } else {
            classString = index % 2 === 1 ? "rowing" : "rowing grey";
          }
          return (
            <div className="testing" key={index}>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.filePath.split("/").pop().slice(0, -4)}
              </h4>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.artist || "UNKNOWN"}
              </h4>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.album || "UNKNOWN"}
              </h4>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.year}
              </h4>
              {/* <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.genre}
              </h4> */}
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.songDuration}
              </h4>
            </div>
          );
        })}
      </div>
      <div className="music-prev">
        {props.counter !== -1 ? (
          <MusicPreview
            title={props.title}
            artist={props.artist}
            img={props.data[props.counter].imageBuffer}
            image={props.image}
            prevSong={props.prevSong}
            play={props.play}
            shuffle={props.shuffle}
            loop={props.loop}
            playPauseHandler={props.playPauseHandler}
            nextSong={props.nextSong}
            handleShuffle={props.handleShuffle}
            repeatSong={props.repeatSong}
            changePage={props.changePage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Home;
