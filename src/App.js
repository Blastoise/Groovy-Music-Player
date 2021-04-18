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
    loop: 0,
    shuffle: false,
    songs: [],
    counter: -1,
    title: "",
    artist: "",
    image: "./default.png",
    imageBuffer: "",
    currentSong: "",
    loaded: false,
    animationLoad: false,
  };
  audio = null;
  playPauseHandler = () => {
    this.state.play === true ? this.audio.pause() : this.audio.play();
    this.setState((state) => {
      return { play: !state.play };
    });
  };

  componentDidMount() {
    ipcRenderer.on("open-dir-results", (event, args) => {
      if (args.length !== 0) {
        // console.log(args[0].title);
        this.addSongs(args);
      } else {
        this.addSongs([]);
        // console.log("Args not received");
        // console.log(args);
      }
    });

    ipcRenderer.send("init-data", "Initial Data");
    this.setState({ animationLoad: true });
    ipcRenderer.once("init-data", (event, args) => {
      if (args) {
        args = JSON.parse(args);

        if (Object.keys(args).length !== 0) {
          let songs = [];
          for (const song in args) {
            songs.push(args[song]);
          }
          // console.log(songs[0].title);
          this.addSongs(songs);
        } else {
          this.addSongs([]);
        }
      } else {
        // console.log("Args not received");
        // console.log(args);
      }
    });

    ipcRenderer.on("fetch-song", (event, args) => {
      // console.log(args);
      this.setState({ currentSong: args.music, loaded: true });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.counter !== this.state.counter ||
      prevState.songs.length !== this.state.songs.length
    ) {
      ipcRenderer.send(
        "fetch-song",
        this.state.songs[this.state.counter].filePath
      );

      if (prevState.songs.length !== this.state.songs.length) {
        this.setState((state) => {
          return {
            title:
              state.songs[state.counter].title ||
              state.songs[state.counter].filePath.split("/").pop().slice(0, -4),
            artist: state.songs[state.counter].artist || "UNKNOWN",
            imageBuffer: state.songs[state.counter].imageBuffer,
          };
        });
      }
    }

    if (this.state.loaded === true && this.state.play === true) {
      // For handling the promise returned by this.audio.play()
      if (prevState.loaded === false) {
        this.audio.load();
      }
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

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  addSongs = (args) => {
    // console.log("Adding song");
    let val;
    this.state.songs.forEach((songElement) => {
      val = args.findIndex(
        (argsElement) => argsElement.filePath === songElement.filePath
      );

      if (val !== -1) {
        args.splice(val, 1);
      }
    });

    if (args.length !== 0) {
      this.setState((state) => {
        return {
          songs: [...state.songs, ...args],
          loaded: false,
          counter: 0,
          animationLoad: false,
        };
      });
    } else {
      this.setState({ animationLoad: false });
    }
  };

  playSelected = (counter) => {
    this.setState((state) => {
      if (state.counter !== counter) {
        return {
          title:
            state.songs[counter].title ||
            state.songs[counter].filePath.split("/").pop().slice(0, -4),
          artist: state.songs[counter].artist || "UNKNOWN",
          imageBuffer: state.songs[counter].imageBuffer,
          counter: counter,
          play: true,
          loaded: false,
        };
      }
      return {
        play: true,
        loaded: true,
      };
    });
  };

  nextSong = () => {
    this.setState((state) => {
      if (state.shuffle === true) {
        let counter = Math.floor(Math.random() * state.songs.length);
        return {
          title:
            state.songs[counter].title ||
            state.songs[counter].filePath.split("/").pop().slice(0, -4),
          artist: state.songs[counter].artist || "UNKNOWN",
          imageBuffer: state.songs[counter].imageBuffer,
          counter: counter,
          play: true,
          loaded: false,
        };
      }
      if (state.songs.length - 1 > state.counter + 1) {
        return {
          title:
            state.songs[state.counter + 1].title ||
            state.songs[state.counter + 1].filePath
              .split("/")
              .pop()
              .slice(0, -4),
          artist: state.songs[state.counter + 1].artist || "UNKNOWN",
          imageBuffer: state.songs[state.counter + 1].imageBuffer,
          counter: state.counter + 1,
          play: true,
          loaded: false,
        };
      }
      return {
        title:
          state.songs[0].title ||
          state.songs[0].filePath.split("/").pop().slice(0, -4),
        artist: state.songs[0].artist || "UNKNOWN",
        imageBuffer: state.songs[0].imageBuffer,
        counter: 0,
        play: true,
        loaded: false,
      };
    });
  };

  prevSong = () => {
    this.setState((state) => {
      if (state.counter > 0) {
        return {
          title:
            state.songs[state.counter - 1].title ||
            state.songs[state.counter - 1].filePath
              .split("/")
              .pop()
              .slice(0, -4),
          artist: state.songs[state.counter - 1].artist || "UNKNOWN",
          imageBuffer: state.songs[state.counter - 1].imageBuffer,
          counter: state.counter - 1,
          play: true,
          loaded: false,
        };
      }
      return {
        title:
          state.songs[state.songs.length - 1].title ||
          state.songs[state.songs.length - 1].filePath
            .split("/")
            .pop()
            .slice(0, -4),
        artist: state.songs[state.songs.length - 1].artist || "UNKNOWN",
        imageBuffer: state.songs[state.songs.length - 1].imageBuffer,
        counter: state.songs.length - 1,
        play: true,
        loaded: false,
      };
    });
  };

  repeatSong = () => {
    this.setState((state) => {
      return state.loop === 2 ? { loop: 0 } : { loop: state.loop + 1 };
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
          loop={this.state.loop === 1 ? true : false}
          onEnded={this.nextSong}
          ref={(input) => {
            this.audio = input;
          }}
        ></audio>

        {this.state.page === true ? (
          <div>
            <div className="top-bar">
              <button
                className="app-add-song-button"
                onClick={() => {
                  ipcRenderer.send("open-dir", "Open Directory");
                  this.setState({ animationLoad: true });
                }}
              >
                <img src="./folder-plus.png" alt="" />
                <p>Add Music Directory</p>
              </button>
              {this.state.animationLoad ? (
                <div className="loading-animation">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                ""
              )}
            </div>

            <Home
              data={this.state.songs}
              title={this.state.title}
              artist={this.state.artist}
              image={this.state.image}
              imageBuffer={this.state.imageBuffer}
              onPage={this.changePage}
              playSelected={this.playSelected}
              counter={this.state.counter}
              prevSong={this.prevSong}
              play={this.state.play}
              shuffle={this.state.shuffle}
              loop={this.state.loop}
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
            shuffle={this.state.shuffle}
            loop={this.state.loop}
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
