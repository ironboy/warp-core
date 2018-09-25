import './MainNav.scss';
import logo from './images/logo.svg';
@observer export default class MainNav extends Component {
  @observable isOpen = false;

  start(){
    // (see utilities/Route - part of fix
    //  for activeLinks update problem)
    this.shared.theMainNav = this;
  }

  toggle(){
    this.isOpen = !this.isOpen;
  }

}
