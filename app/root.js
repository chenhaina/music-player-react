import React from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import { Router, IndexRoute, Link, Route, browserHistory, hashHistory} from 'react-router';
import { MUSIC_LIST } from './config/musiclist';
import Pubsub from 'pubsub-js'

let repeatModel=['cycle','once','random'];
class App extends React.Component{
	
	constructor(props) {
	    super(props)
	    this.state = {
          musicList:MUSIC_LIST,
		  currentMusitItem: MUSIC_LIST[0],
		  repeatState:repeatModel[0],
		  nextMusic:MUSIC_LIST[1]
       }
	   }
	 findNextMusic(musicItem){
	 	this.setState({
			currentMusitItem:musicItem
		})
    	let index = this.findMusicIndex(musicItem);
		index = (index + 1) % this.state.musicList.length;
		let nextmusic = this.state.musicList[index];
		return nextmusic;
    }
	playMusic(musicItem){
		$('#player').jPlayer('setMedia',{
			mp3:musicItem.file
		}).jPlayer('play');
		this.setState({
			currentMusitItem:musicItem,
		})
		let musicmodel=this.state.repeatState;
		if(musicmodel==='cycle'){
			this.setState({
			repeatState:repeatModel[0],
			nextMusic:this.findNextMusic(this.state.currentMusitItem)
		})
		}
		else if(musicmodel==='once'){
			this.setState({
				repeatState:repeatModel[1],
				nextMusic:this.state.currentMusitItem
			})
			
		}
		else if(musicmodel==='random'){
			let indexmusic=Math.floor(Math.random()*5);
			this.setState({
			repeatState:repeatModel[2],
			nextMusic:MUSIC_LIST[indexmusic]
		})	
		}
		else{
			this.setState({
			repeatState:repeatModel[0],
			nextMusic:this.findNextMusic(this.state.currentMusitItem)
		})
		}
	}
    playNext(type = 'next') {
		let index = this.findMusicIndex(this.state.currentMusitItem);
		if (type === 'next') {		
			index = (index + 1) % this.state.musicList.length;
		} else {
			index = (index + this.state.musicList.length - 1) % this.state.musicList.length;
		}
		let musicItem = this.state.musicList[index];
		this.setState({
			currentMusitItem: musicItem			
		});
		this.playMusic(musicItem);
	}
   
	findMusicIndex(musicItem){
		return this.state.musicList.indexOf(musicItem);
	}
	playOnce(){	
		console.log(this.state.repeatState);
		let indexmusic=Math.floor(Math.random()*5);
		this.setState({
			repeatState:repeatModel[2],
			nextMusic:MUSIC_LIST[indexmusic]
		})		
		console.log(this.state.repeatState);
	}
	playCycle(){
		console.log(this.state.repeatState);
		console.log(1);
		this.setState({
			repeatState:repeatModel[1],
			nextMusic:this.state.currentMusitItem
		})
		console.log(2);
		console.log(this.state.repeatState);
	}
	playRandom(){
		console.log(this.state.repeatState);
		this.setState({
			repeatState:repeatModel[0],
			nextMusic:this.findNextMusic(this.state.currentMusitItem)
		})
		console.log(this.state.repeatState);
	}
	componentDidMount(){
		$('#player').jPlayer({
        	supplied:'mp3',
			wmode:'window',
			useStateClassSkin: true
		});
		this.playMusic(this.state.currentMusitItem);
		$('#player').bind($.jPlayer.event.ended,(e)=>{
			this.playMusic(this.state.nextMusic);
		})
		Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
			this.setState({
				musicList:this.state.musicList.filter(item=>{
					return item!==musicItem;
				})
			})
		})
		Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
			this.playMusic(musicItem)
		})
		Pubsub.subscribe('PLAY_NEXT',(msg,musicItem)=>{
			this.playNext();
		})
		Pubsub.subscribe('PLAY_PREV',(msg,musicItem)=>{
			this.playNext('prev')
		})
		Pubsub.subscribe('PLAY_ONCE',(msg,musicItem)=>{
			this.playOnce()
		})
		Pubsub.subscribe('PLAY_CYCLE',(msg,musicItem)=>{
			this.playCycle();
		})
		Pubsub.subscribe('PLAY_RANDOM',(msg,musicItem)=>{
			this.playRandom();
		})
	}
	componentWillUnMount(){
		PubSub.unsubscribe('PLAY_MUSIC');
		PubSub.unsubscribe('DELETE_MUSIC');
		PubSub.unsubscribe('PLAY_ONCE');
		PubSub.unsubscribe('PLAY_CYCLE');
		PubSub.unsubscribe('PLAY_RANDOM');
		PubSub.unsubscribe('PLAY_NEXT');
		PubSub.unsubscribe('PLAY_PREV');
		$('#player').unbind($.jPlayer.event.ended);
	}
	
	render(){
		return(
			<div>
			<Header/>
			{React.cloneElement(this.props.children , this.state)}			
			</div>
		)
	}
}

class Root extends React.Component{
	render(){
	return(
		<Router history={hashHistory}>
		    <Route path="/" component={App}>
			    <IndexRoute component={Player}></IndexRoute>
			    <Route path="/list" component={MusicList} ></Route>
			</Route>
		</Router>
	)
	}
}
export default Root;