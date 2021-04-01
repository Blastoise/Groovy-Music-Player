import React, { Component } from "react";
import "./App.css";
import { faRandom, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

// TODO check for leaks in ComponentUpdate as we need to add ComponentDidUnmount
class App extends Component {
  state = {
    play: false,
    loop: false,
    shuffle: false,
    songs: [],
    counter: 0,
    title: "Incomplete",
    artist: "Backstreet Boys",
    image: "./wp2793970.jpg",
    imageBuffer: "",
    currentSong: "./Incomplete.mp3",
  };
  audio = null;
  playPauseHandler = () => {
    // console.log(this.state.play);
    this.state.play === true ? this.audio.pause() : this.audio.play();
    this.setState({ play: !this.state.play });
  };

  componentDidUpdate() {
    if (this.state.play === true) {
      this.audio.play();
    }
  }

  addSongs = (args) => {
    console.log("Adding song");
    // this.audio = new Audio(args[0].music);
    this.setState({
      songs: args,
      title: args[0].title,
      artist: args[0].artist,
      imageBuffer: args[0].imageBuffer,
      currentSong: args[0].music,
    });
  };

  nextSong = () => {
    if (this.state.play === true) {
      this.audio.pause();
    }
    if (this.state.songs.length - 1 >= this.state.counter + 1) {
      const count = this.state.counter;
      // this.audio = new Audio(this.state.songs[count + 1].music);
      this.setState({
        title: this.state.songs[count + 1].title,
        artist: this.state.songs[count + 1].artist,
        imageBuffer: this.state.songs[count + 1].imageBuffer,
        currentSong: this.state.songs[count + 1].music,
        counter: count + 1,
      });
    } else {
      // this.audio = new Audio(this.state.songs[0].music);
      this.setState({
        title: this.state.songs[0].title,
        artist: this.state.songs[0].artist,
        imageBuffer: this.state.songs[0].imageBuffer,
        currentSong: this.state.songs[0].music,
        counter: 0,
      });
    }
  };

  prevSong = () => {
    if (this.state.play === true) {
      this.audio.pause();
    }
    if (this.state.counter > 0) {
      const count = this.state.counter;
      // this.audio = new Audio(this.state.songs[count - 1].music);
      this.setState({
        title: this.state.songs[count - 1].title,
        artist: this.state.songs[count - 1].artist,
        imageBuffer: this.state.songs[count - 1].imageBuffer,
        currentSong: this.state.songs[count - 1].music,
        counter: count - 1,
      });
    } else {
      // this.audio = new Audio(
      //   this.state.songs[this.state.songs.length - 1].music
      // );
      this.setState({
        title: this.state.songs[this.state.songs.length - 1].title,
        artist: this.state.songs[this.state.songs.length - 1].artist,
        imageBuffer: this.state.songs[this.state.songs.length - 1].imageBuffer,
        currentSong: this.state.songs[this.state.songs.length - 1].music,
        counter: this.state.songs.length - 1,
      });
    }
  };

  repeatSong = () => {
    console.log(!this.state.loop);
    // this.audio.loop = !this.state.loop;

    this.setState({ loop: !this.state.loop });
  };

  handleShuffle = () => {
    this.setState({ shuffle: !this.state.shuffle });
  };

  changeAudio = (args) => {
    console.log("here");

    this.setState({
      title: args.title,
      artist: args.artist,
      imageBuffer: args.imageBuffer,
      audio: new Audio(args.music),
    });
  };

  styleObject = () => {
    if (this.state.imageBuffer === "") {
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
            ipcRenderer.on("modal-file-results", (event, args) => {
              console.log(args[0].title);
              // console.log(args);
              // console.log(this);
              this.addSongs(args);
              // this.changeAudio(args);
            });
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
                  this.state.imageBuffer === ""
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
              <img src="./backward.svg" alt="" onClick={this.prevSong} />
              <img
                src={this.state.play === true ? "./pause.svg" : "./play.svg"}
                alt=""
                onClick={this.playPauseHandler}
              />
              <img src="./forward.svg" alt="" onClick={this.nextSong} />
              <FontAwesomeIcon
                icon={faRandom}
                style={{ color: "black" }}
                mask={faCircle}
                size="3x"
              />

              <img
                src="./repeat.svg"
                alt=""
                onClick={this.repeatSong}
                className="symbol"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
