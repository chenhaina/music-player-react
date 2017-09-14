import React from 'react';
import {AppContainer }from 'react-hot-loader';
import { render } from 'react-dom';
import Root from './root'

render(
  <AppContainer>
  <Root/>
  </AppContainer>,
  document.getElementById('root')
);

if(module.hot){
	module.hot.accept('./root',()=>{
		const NewHello=require('./root').default;
		render(
			<AppContainer>
			  <Root/>
			  </AppContainer>,
			  document.getElementById('root')
		);
	})
}
