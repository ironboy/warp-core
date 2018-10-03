@observer export default class Loop extends Component {

  componentWillReact(){
    this.start();
  }

  start(){
    this.all = [];
    // some checks
    let x, twoArgs;
    try {
      let f = this.props.children + '';
      twoArgs = f.substring(f.indexOf('('),f.indexOf(')')).includes(',');
      if(typeof this.props.children !== 'function'){ throw(new Error('')); }
    }
    catch(e){
      throw(new Error('Provide a function as the only child for <Loop/>'));
    }
    let iterable = this.props.i, sepVals;
    if(!this.isIterable(iterable)){
      if(!iterable || typeof iterable !== 'object'){
        throw(new Error('Provide an iterable or an object as the i property for <Loop/>'));
      }
      iterable = Object.keys(iterable);
      sepVals = this.props.i;
    }
    // do the actual loop
    for(let item of iterable){
      let keyVal;
      if(sepVals){ keyVal = item; }
      else if(typeof item === 'object'){
        keyVal = item[this.props.key] || item._id || item.id || item.ID;
        if(keyVal === undefined){
          try { keyVal = item[this.props.key || '_id'] = Math.random();}
          catch(e){}
        }
      }
      if(keyVal === undefined) {
        keyVal = this.all.length;
      }
      if(twoArgs){
        x = this.props.children(keyVal, sepVals ? sepVals[item] : item);
      }
      else {
        x = this.props.children(sepVals ? sepVals[item] : item);
      }
      // inject the key
      let y = React.createElement(
        x.type,
        {...x.props, key: keyVal},
        x.props.children
      );
      this.all.push(y);
    }
  }

  isIterable(obj) {
    return obj && typeof obj[Symbol.iterator] === 'function';
  }
}