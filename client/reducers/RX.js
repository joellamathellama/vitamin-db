const RX = (state, action) => {
  if(state === undefined){
    return state = [];
  }
  switch(action.type){
  	case 'SETMYINFO':
  		return action.list.rx || state;
  	default:
  		return state;
  }
};

module.exports = RX;