import React, { Component } from "react";
import Home from "./components/Home";
import "./App.css";
import Music from "./components/Music";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

class App extends Component {
  state = {
    page: true,
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
      if (args) {
        console.log(args[0].title);
        this.addSongs(args);
      } else {
        console.log("Args aaya hi nhi");
        console.log(args);
      }
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

  playSelected = (counter) => {
    this.setState((state) => {
      return {
        title: state.songs[counter].title,
        artist: state.songs[counter].artist,
        imageBuffer: state.songs[counter].imageBuffer,
        counter: counter,
        play: true,
      };
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

  changePage = () => {
    this.setState((state) => {
      return { page: !state.page };
    });
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

        {this.state.page === true ? (
          <div>
            <button
              onClick={() => {
                ipcRenderer.send("modal-file-content", "done");
              }}
            >
              Get songs
            </button>
            <Home
              data={this.state.songs}
              onPage={this.changePage}
              playSelected={this.playSelected}
              counter={this.state.counter}
              prevSong={this.prevSong}
              play={this.state.play}
              playPauseHandler={this.playPauseHandler}
              nextSong={this.nextSong}
              handleShuffle={this.handleShuffle}
              repeatSong={this.repeatSong}
              changePage={this.changePage}
            />
          </div>
        ) : (
          <Music
            styleObject={this.styleObject}
            imageBuffer={this.state.imageBuffer}
            image={this.state.image}
            title={this.state.title}
            artist={this.state.artist}
            prevSong={this.prevSong}
            play={this.state.play}
            playPauseHandler={this.playPauseHandler}
            nextSong={this.nextSong}
            handleShuffle={this.handleShuffle}
            repeatSong={this.repeatSong}
            changePage={this.changePage}
          />
        )}
      </div>
    );
  }
}

export default App;
