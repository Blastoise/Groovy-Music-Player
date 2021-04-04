import React, { Component } from "react";
import "./App.css";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

// TODO check for leaks in ComponentUpdate as we need to add ComponentDidUnmount
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
    this.setState({ play: !this.state.play });
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
      console.log("Request bheje hai");
      ipcRenderer.send(
        "fetch-song",
        this.state.songs[this.state.counter].filePath
      );
    }
    // else {
    //   if (this.state.play === true) {
    //     this.audio.pause();
    //     this.audio.load();
    //     this.audio.play();
    //   }
    // }
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
    // if (this.state.play === true) {
    //   this.audio.pause();
    // }
    if (this.state.songs.length - 1 >= this.state.counter + 1) {
      const count = this.state.counter;

      this.setState({
        title: this.state.songs[count + 1].title,
        artist: this.state.songs[count + 1].artist,
        imageBuffer: this.state.songs[count + 1].imageBuffer,
        counter: count + 1,
        play: false,
      });
    } else {
      this.setState({
        title: this.state.songs[0].title,
        artist: this.state.songs[0].artist,
        imageBuffer: this.state.songs[0].imageBuffer,
        counter: 0,
        play: false,
      });
    }
  };

  prevSong = () => {
    // if (this.state.play === true) {
    //   this.audio.pause();
    // }
    if (this.state.counter > 0) {
      const count = this.state.counter;

      this.setState({
        title: this.state.songs[count - 1].title,
        artist: this.state.songs[count - 1].artist,
        imageBuffer: this.state.songs[count - 1].imageBuffer,
        counter: count - 1,
        play: false,
      });
    } else {
      this.setState({
        title: this.state.songs[this.state.songs.length - 1].title,
        artist: this.state.songs[this.state.songs.length - 1].artist,
        imageBuffer: this.state.songs[this.state.songs.length - 1].imageBuffer,
        counter: this.state.songs.length - 1,
        play: false,
      });
    }
  };

  repeatSong = () => {
    console.log(!this.state.loop);

    this.setState({ loop: !this.state.loop });
  };

  handleShuffle = () => {
    this.setState({ shuffle: !this.state.shuffle });
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
