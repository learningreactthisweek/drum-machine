import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Sound from 'react-sound';


const SEQUENCER_STEPS = 16;
const SAMPLE_NUMBER = 6;
const sequenceTimeouts = [];
const drumMapping = {
  0: "kick.wav",
  1: "snare.wav",
  2: "hihat.wav",
  3: "hihat.wav",
  4: "hihat.wav",
  5: "hihat.wav",
}


class DrumSound extends React.Component {
  render() {
    return (
      <Sound
        url={drumMapping[this.props.row]}
        playStatus={Sound.status.PLAYING} 
      />
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    //Update each time pad is selected and at current step
    return this.props.stepMatch & this.props.playSound ? true : false;
  }
}

class DrumPad extends React.Component {
  render() {
    return (
      <td>
        <div onClick={() => this.props.onClick()} className="drum-pad" data-playing={this.props.stepMatch}>
          <div data-drum-select={this.props.padSelected}>
            <DrumSound 
              playSound={this.props.padSelected} 
              stepMatch={this.props.stepMatch}
              row={this.props.row}
            />
          </div>
        </div>
      </td>
    );
  }
}

class DrumRow extends React.Component {
  render() {
    return (
      <tr>
        {[...Array(SEQUENCER_STEPS)].map((item, step) =>
          <DrumPad
            onClick={() => this.props.onClick(this.props.row, step)}
            key={step}
            row={this.props.row}
            padSelected={this.props.drumSampleRow[step]}
            stepMatch={this.props.currentStep === step}
          />
        )}
      </tr>
    );
  }
}


class DrumGrid extends React.Component {
  render() {
    return (
      <table>
        <tbody id={this.props.stepIndex}>
          {[...Array(SAMPLE_NUMBER)].map((item, row) =>
            <DrumRow
              onClick={(x, y) => this.props.onClick(x, y)}
              key={row}
              row={row}
              drumSampleRow={this.props.drumMatrix[row]}
              currentStep={this.props.stepIndex}
            />
          )}
        </tbody>
      </table>
    );
  }
}


function ActionButton(props) {
  return (
    <div className={props.action}>
      <i className={props.symbolClass} onClick={() => props.onClick()}></i>
    </div>
  );
}


class DrumMachine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drumGrid: [...Array(SAMPLE_NUMBER)].map((item, i) =>
                  Array(SEQUENCER_STEPS).fill(false)),
      currentIndex: -1,
      setInt: null
    }
  }

  handleClick(sample, step) {
    let currentMatrix = this.state.drumGrid.slice();
    currentMatrix[sample][step] = currentMatrix[sample][step] ? false : true
    this.setState({'drumGrid': currentMatrix})
  }

  playDrums() {
    if (this.state.currentIndex === -1) {
      this.startSequencer();
    }
  }

  singleSequencerRun() {
    var currentTime = 0;
    var incrementTime = 200;
    for (let step = 0; step < 16; step++) {
      //Increment in the future by 200
      sequenceTimeouts.push(setTimeout(this.stepIncrementer.bind(this), currentTime))
      currentTime += incrementTime;
    }
  }

  stepIncrementer(audio) {
    if (this.state.currentIndex < 15) {
      let currentIndex = this.state.currentIndex + 1
      this.setState({'currentIndex': currentIndex})
    } else {
      this.setState({'currentIndex': 0})
    }
  }

  startSequencer() {
    //Kick off first run and loop indefinetly until stop action
    this.singleSequencerRun()
    this.setState({'setInt' : setInterval(this.singleSequencerRun.bind(this), 3200)})
  }

  stopSequencer() {
    // Clear setInterval and any current timeouts
    clearInterval(this.state.setInt);
    sequenceTimeouts.map(
      (timeout, i) => clearTimeout(timeout)
    )
    this.setState({currentIndex: -1})
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1 className="header-title">Money Maker 9000</h1>
          <div className="playback-container">
            <ActionButton
              onClick={() => this.stopSequencer()}
              action="stop"
              symbolClass="fa fa-3x fa-stop"
            />
            <ActionButton
              onClick={() => this.playDrums()}
              action="play"
              symbolClass="fa fa-play-circle fa-3x"
            />
          </div>
        </div>
        <DrumGrid
          drumMatrix={this.state.drumGrid}
          onClick={(x,y) => this.handleClick(x,y)}
          stepIndex={this.state.currentIndex}
        />
      </div>
    );
  }
}


ReactDOM.render(
  <DrumMachine />,
  document.getElementById('root')
);
