const React = require('react');
const Router = require('react-router');
const Link = Router.Link;
const connect = require('react-redux').connect;
const apiAction = require('../actionCreators/apiActions');
const stateAction = require('../actionCreators/stateActions');
const browserHistory = Router.browserHistory;

function getCookie(cname) {
   var name = cname + "=";
   var ca = document.cookie.split(';');
   for(var i=0; i<ca.length; i++) {
       var c = ca[i];
       while (c.charAt(0)==' ') c = c.substring(1);
       if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
   }
   return "";
};
const tookie = getCookie("token");
console.log(tookie)

const Header = ({ goHome, signOut, goProfile, goAppoint, signUp, logged, goSplash }) => {
	return (
	  <nav className="navbar navbar-default">
        <div className="container-fluid">
          <ul className="nav nav-tabs">
          	  <li><button onClick={goSplash}> LOGO </button></li>
	          <li role="presentation">{logged && <button onClick={goHome}> Home </button>}</li>
	          <li role="presentation">{logged && <button onClick={goProfile}> Profile </button>}</li>
	          <li role="presentation">{logged && <button onClick={goAppoint}> Appointments </button>}</li>
	          <li role="presentation">{logged && <button onClick={signOut}> Sign out </button>}</li>
	          <li role="presentation">{!logged && <button onClick={signUp}> Sign up </button>}</li>
          </ul>
        </div> 
	  </nav>
	);
};

const mapStateToProps = (state) => {
	console.log('header state', state)
	return {
		logged: window.localStorage.getItem("token")
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		goSplash: () => {
			browserHistory.push('/')
		},
		goHome: () => {
			if(tookie){
				browserHistory.push('/home?token=' + tookie)
			}else{
				browserHistory.push('/')
			}
		},
		goProfile: () => {
			if(tookie){
				browserHistory.push('/profile?token=' + tookie)
			}else{
				browserHistory.push('/')
			}
		},
		goAppoint: () => {
			if(tookie){
				browserHistory.push('/appointments?token=' + tookie)
			}else{
				browserHistory.push('/')
			}
		},
		signUp: () => {
			if(!window.localStorage.getItem("token")){
				browserHistory.push('/signup')
			}
		},
		signOut: () => {
			dispatch(stateAction.SignOut());
			if(!window.localStorage.getItem("token")){
				browserHistory.push('/')
			}
		}
	};
};

var wrappedHeader = connect(
	mapStateToProps, 
	mapDispatchToProps
)(Header);

module.exports = wrappedHeader;