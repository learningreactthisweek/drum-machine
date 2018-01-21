import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Sound from 'react-sound';

const SEQUENCER_STEPS = 16;
const SAMPLE_NUMBER = 6;


class DrumPad extends React.Component {
  render() {
    return (
      <td className={this.props.value}>
        <div 
          onClick={this.props.onClick} 
          shape="rectangle" 
          value="None" 
          className={"beat" + this.props.value} 
          name="check" 
          id={this.props.value}
        />
        <div 
          shape="None" 
          className="circle" 
        />
        </div>
      </td>
    );
  }
}


class DrumRow extends React.Component {
  render() {
    return (
      <tr className="drum-sample">
        {[...Array(SEQUENCER_STEPS)].map((item, i) => 
          <DrumPad 
            onClick={() => this.props.onClick()} key={i} value={i}
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
        <tbody>
          {[...Array(SAMPLE_NUMBER)].map((item, i) => 
            <DrumRow 
              onClick={() => this.props.onClick()} key={i} name={i} 
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
      <i className={props.symbolClass}></i>
    </div>
  );
}


class DrumMachine extends React.Component {
  render() {
    return (
      <div>
        <div className="header">
          <h1 className="header-title">Money Maker 9000</h1>
          <div className="playback-container">
            <ActionButton 
              action="play" 
              symbolClass="fa fa-3x fa-stop"
            />
            <ActionButton 
              action="stop" 
              symbolClass="fa fa-play-circle fa-3x"
            />
          </div>
        </div>
        <DrumGrid 
          onClick={() => this.handleClick()}
        />
      </div>
    );
  }

  handleClick() {
    
  }
}


ReactDOM.render(
  <DrumMachine />,
  document.getElementById('root')
);
