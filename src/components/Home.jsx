import React from "react";
import MusicPreview from "./MusicPreview";
import "./Home.css";

const Home = (props) => {
  return (
    <div className="home-container">
      <h1 className="home-head">My Music</h1>
      <div className="home-sections">
        <h2 className="head-active">Songs</h2>
        <h2>Artists</h2>
        <h2>Albums</h2>
      </div>

      <div className="head-flex-column">
        {props.data.map((element, index) => {
          let classString;
          classString = index % 2 === 1 ? "rowing" : "rowing grey";
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
                {element.artist}
              </h4>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.album}
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
            title={props.data[props.counter].title}
            artist={props.data[props.counter].artist}
            img={props.data[props.counter].imageBuffer}
            prevSong={props.prevSong}
            play={props.play}
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
