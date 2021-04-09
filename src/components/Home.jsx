import React from "react";
import MusicPreview from "./MusicPreview";
import "./Home.css";

const Home = (props) => {
  return (
    <div className="home-container">
      <button onClick={props.onPage}>Page Change</button>
      <h1 className="home-head">My Music</h1>
      <div className="home-sections">
        <h2 className="head-active">Songs</h2>
        <h2>Artists</h2>
        <h2>Albums</h2>
      </div>

      <div className="head-flex-column">
        {props.data.map((element, index) => {
          let classString;
          classString = index % 2 === 0 ? "rowing" : "rowing grey";
          return (
            <React.Fragment key={index}>
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
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.genre}
              </h4>
              <h4
                className={classString}
                onClick={() => props.playSelected(index)}
              >
                {element.duration}
              </h4>
            </React.Fragment>
          );
        })}
      </div>
      <div className="music-prev">
        <MusicPreview
          title={props.data[props.counter].title}
          artist={props.data[props.counter].artist}
          img={props.data[props.counter].imageBuffer}
        />
      </div>
    </div>
  );
};

export default Home;
