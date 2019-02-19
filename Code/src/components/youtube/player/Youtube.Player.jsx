import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './Youtube.Player.scss';
import {YoutubeService}from '../../../services/youtube/Youtube';
const youtube= new YoutubeService();
class YoutubePlayer extends Component {
  async componentWillMount(){
    if(!await youtube.isValid(this.id)){
        window.location.href='/';
    }
  }
  constructor(props) {
    super(props);
    this.state = {};
    this.id = window.location.href
      .replace(/^.*\//g, '')
      .replace(/^.*\..*/g, '');
    const iFrame=`<iframe id="embedded-video" title="Video" width="100%" height="100%" src="https://www.youtube.com/embed/${this.id}?autoplay=1" frameBorder="0" allowFullScreen/>" />`;
    setTimeout(() => {
      if (document.getElementsByClassName('frame-block')[0]) {
        document.getElementsByClassName('frame-block')[0].innerHTML = iFrame;
      }
    }, 1000);

  }

  render() {
    return (
      <div className="video-container">
        <div className="frame-block"/>
        <div className="controls">
          <Link className="btn btn-primary" to="/youtube"> &#60; Back to Trends</Link>
        </div>
      </div>);
  }
}

export default YoutubePlayer;
