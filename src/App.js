import React, { Component } from "react";
import "./App.css";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    play: false,
    loop: false,
    shuffle: false,
    songs: [],
    counter: -1,
    title: "Incomplete",
    artist: "Backstreet Boys",
    image: "./wp2793970.jpg",
    imageBuffer: "",
    currentSong: "./Incomplete.mp3",
  };
  audio = null;
  playPauseHandler = () => {
    this.state.play === true ? this.audio.pause() : this.audio.play();
    this.setState((state) => {
      return { play: !state.play };
    });
  };

  componentDidMount() {
    ipcRenderer.on("modal-file-results", (event, args) => {
      console.log(args[0].title);
      this.addSongs(args);
    });

    ipcRenderer.on("fetch-song", (event, args) => {
      console.log(args);
      this.setState({ currentSong: args.music });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.counter !== this.state.counter) {
      ipcRenderer.send(
        "fetch-song",
        this.state.songs[this.state.counter].filePath
      );
    }

    if (
      prevState.currentSong !== this.state.currentSong &&
      this.state.play === true
    ) {
      // For handling the promise returned by this.audio.play()
      this.audio
        .play()
        .then(() => {
          console.log("Started Playing!");
        })
        .catch((err) => {
          console.log("Song Stopped!");
        });
    }
  }

  addSongs = (args) => {
    console.log("Adding song");

    this.setState({
      songs: args,
      title: args[0].title,
      artist: args[0].artist,
      imageBuffer: args[0].imageBuffer,
      counter: 0,
    });
  };

  nextSong = () => {
    this.setState((state) => {
      if (state.songs.length - 1 > state.counter + 1) {
        return {
          title: state.songs[state.counter + 1].title,
          artist: state.songs[state.counter + 1].artist,
          imageBuffer: state.songs[state.counter + 1].imageBuffer,
          counter: state.counter + 1,
        };
      }
      return {
        title: state.songs[0].title,
        artist: state.songs[0].artist,
        imageBuffer: state.songs[0].imageBuffer,
        counter: 0,
      };
    });
  };

  prevSong = () => {
    this.setState((state) => {
      if (state.counter > 0) {
        return {
          title: state.songs[state.counter - 1].title,
          artist: state.songs[state.counter - 1].artist,
          imageBuffer: state.songs[state.counter - 1].imageBuffer,
          counter: state.counter - 1,
        };
      }
      return {
        title: state.songs[state.songs.length - 1].title,
        artist: state.songs[state.songs.length - 1].artist,
        imageBuffer: state.songs[state.songs.length - 1].imageBuffer,
        counter: state.songs.length - 1,
      };
    });
  };

  repeatSong = () => {
    this.setState((state) => {
      return { loop: !state.loop };
    });
  };

  handleShuffle = () => {
    this.setState((state) => {
      return { shuffle: !state.shuffle };
    });
  };

  styleObject = () => {
    if (!this.state.imageBuffer) {
      return {
        backgroundImage: `url(${this.state.image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      };
    } else {
      let prefix = "data:jpeg;base64,";
      return {
        backgroundImage: `url(${prefix}${this.state.imageBuffer})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
      };
    }
  };

  render() {
    return (
      <div>
        <audio
          hidden
          src={this.state.currentSong}
          loop={this.state.loop}
          onEnded={this.nextSong}
          ref={(input) => {
            this.audio = input;
          }}
        ></audio>
        <button
          onClick={() => {
            ipcRenderer.send("modal-file-content", "done");
          }}
        >
          Get songs
        </button>
        <div className="main">
          <div className="background-img" style={this.styleObject()}></div>
          <div className="main_div">
            <div className="music-container">
              <img
                src={
                  !this.state.imageBuffer
                    ? this.state.image
                    : `data:jpeg;base64,${this.state.imageBuffer}`
                }
                alt=""
              />
              <div className="music-info">
                <h1>{this.state.title}</h1>
                <h2>{this.state.artist}</h2>
              </div>
            </div>
            <div className="music-controls">
              <img
                src="./backward.svg"
                alt=""
                className="prev-button"
                onClick={this.prevSong}
              />
              <img
                src={this.state.play === true ? "./pause.svg" : "./play.svg"}
                alt=""
                className="play-button"
                onClick={this.playPauseHandler}
              />
              <img
                src="./forward.svg"
                alt=""
                className="next-button"
                onClick={this.nextSong}
              />
              <img
                src="./shuffle.svg"
                alt=""
                className="shuffle-button"
                onClick={this.handleShuffle}
              />
              <img
                src="./repeat.svg"
                alt=""
                onClick={this.repeatSong}
                className="repeat-button"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
