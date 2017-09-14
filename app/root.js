import React from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import { Router, IndexRoute, Link, Route, browserHistory, hashHistory} from 'react-router';
import { MUSIC_LIST } from './config/musiclist';
import Pubsub from 'pubsub-js'
class App extends React.Component{
	constructor(props) {
	    super(props)
	    this.state = {
          musicList:MUSIC_LIST,
		  currentMusitItem: MUSIC_LIST[0]
       }
	   }
	playMusic(musicItem){
		$('#player').jPlayer('setMedia',{
			mp3:musicItem.file
		}).jPlayer('play');
		this.setState({
			currentMusitItem:musicItem
		})
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
	componentDidMount(){
		$('#player').jPlayer({
        	supplied:'mp3',
			wmode:'window',
			useStateClassSkin: true
		});
		this.playMusic(this.state.currentMusitItem);
		$('#player').bind($.jPlayer.event.ended,(e)=>{
			this.playNext();
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
	}
	componentWillUnMount(){
		PubSub.unsubscribe('PLAY_MUSIC');
		PubSub.unsubscribe('DELETE_MUSIC');
		PubSub.unsubscribe('CHANAGE_REPEAT');
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