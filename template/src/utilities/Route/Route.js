// We want a slightly different behavior
// for routes compared to what's standard
// for React Router:

// They should display their children
// when the route matches (and not always).

export default class Route extends Component {

  start(){
    this.propsModded = {...this.props};
    let c = this.propsModded.children;
    if(c){ this.propsModded.render = () => c; }
    delete this.propsModded.children;
  }
  
}