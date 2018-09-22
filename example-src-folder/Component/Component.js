export default class MyComponent extends Component {
 
  // Here we simplify things abit for other components:
  //
  // 1. We transfer the props to this.
  // 2. We create a simple update method
  //    that will only attempt rerendering while
  //    a component is mounted.
  // 3. We add some simple convenience methods
  //    for fetching and sleeping.
 
  constructor(props){
    super();
    Object.assign(this, props);
    //this.wrapMountUnmount();
    //return this.proxify();
  }

  /*proxify(){
    let that = this, timeout;
    return new Proxy(this, {set(target, property, value, receiver){
      if(!(['props', 'state', 'context'].includes(property))){
        clearTimeout(timeout);
        timeout = setTimeout(() => that.update(), 1);
      }
      return Reflect.set(target, property, value, receiver);
    }});
  }
 
  wrapMountUnmount(){
    let orgDidMount = this.componentDidMount || (()=>{});
    let orgWillUnmount = this.componentWillUnmount || (()=>{});
    this.componentDidMount = function(...args){
      this._mounted = true;
      return orgDidMount.apply(this, args);
    }
    this.componentWillUnmount = function(...args){
      this._mounted = false;
      return orgWillUnmount.apply(this, args);
    }
  }
 
  update(){
    this._mounted && this.setState(this);
  }*/
 
  async fetch(path){
    return (await fetch(path)).json();
  }
 
  // Call sleep with await inside async functions
  sleep(ms){
    return new Promise(res => setTimeout(res, ms));
  }
 
}

