import React from 'react';
import './musiclistitem.less'
import Pubsub from 'pubsub-js'

class MusicListItem extends React.Component{
	playMusic(musicItem,event){
		Pubsub.publish('PLAY_MUSIC',musicItem);
	}
	deleteMusic(musicItem,event){
	event.stopPropagation();
	PubSub.publish('DEL_MUSIC', musicItem);
	}
	render(){		
	const musicItem=this.props.musicItem;	
			return(
				<li onClick={this.playMusic.bind(this,musicItem)} className={`row components-listitem${this.props.focus ? ' focus' : ''}`} >
				<p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
				<p onClick={this.deleteMusic.bind(this,musicItem)} className="-col-auto detele"></p>
				</li>
			)		
	}
}
export default MusicListItem;