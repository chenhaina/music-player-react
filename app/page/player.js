import React from 'react';
import Progress from '../components/progress';
import './player.less';
import { Link }from 'react-router';
let PubSub = require('pubsub-js');


let duration=null;
class Player extends React.Component{	 
		constructor(props) {
	    super(props)
	    this.state = {
	        progress: 0,
			volume: 0,
			isPlay: true,
			leftTime: ''			
	    }
	  }
	componentDidMount() {
		$("#player").bind($.jPlayer.event.timeupdate, (e) => {
			duration = e.jPlayer.status.duration;
			this.setState({
				progress: e.jPlayer.status.currentPercentAbsolute,
				volume: e.jPlayer.options.volume * 100,
				leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			});
		});
	}
	componentWillUnmount() {
		$("#player").unbind($.jPlayer.event.timeupdate);
	}
	formatTime(time) {
		time = Math.floor(time);
		let miniute = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);

		return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
	}
	changeProgressHandler(progress) {
		$("#player").jPlayer("play", duration * progress);
		this.setState({
			isPlay: true
		});
	}
	changeVolumeHandler(progress) {
		$("#player").jPlayer("volume", progress);
	}
	play() {
		if (this.state.isPlay) {
			$("#player").jPlayer("pause");
		} else {
			$("#player").jPlayer("play");
		}
		this.setState({
			isPlay: !this.state.isPlay
		});
	}
	playNext() {
		PubSub.publish('PLAY_NEXT');
	}
	playPrev() {
		PubSub.publish('PLAY_PREV');
	}
	changerepeatState() {	
		let repstate=this.props.repeatState;
		if(repstate==='once'){
			PubSub.publish('PLAY_ONCE');
		}
		else if(repstate==='cycle'){			
			PubSub.publish('PLAY_CYCLE');
		}
		else if(repstate==='random'){
			PubSub.publish('PLAY_RANDOM');
		}
		else{
			PubSub.publish('PLAY_CYCLE');
		}
		
	}
 render() {
 	
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusitItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusitItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">-{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
					                <Progress
										progress={this.state.volume}
										onProgressChange={this.changeVolumeHandler.bind(this)}
										barColor='#aaa'
					                >
					                </Progress>					                
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px',marginTop:10}}>                		
			                <Progress
								progress={this.state.progress}
								onProgressChange={this.changeProgressHandler.bind(this)}
								barColor='green'
			                >
			                </Progress>
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev}></i>
	                			<i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
	                			<i className="icon next ml20" onClick={this.playNext}></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.props.repeatState}`} onClick={this.changerepeatState.bind(this)}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusitItem.cover} alt={this.props.currentMusitItem.title}/>
                	</div>
                </div>
            </div>
        )
    }
}
export default Player;