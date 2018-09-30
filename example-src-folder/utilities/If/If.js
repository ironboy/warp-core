export default class If extends Component {
  
  start(){
    if(this.props.condition || this.props.c){
      this.children = this.props.children;
    }
    else {
      try {
        for(let child of this.props.children){
          if((child.type === ElseIf && (child.props.condition || child.props.c)) || child.type === Else){
            this.children = child.props.children;
            break;
          }
        }
      }
      catch(e){}
    }
  }
}