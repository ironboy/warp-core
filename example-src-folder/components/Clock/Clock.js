import './Clock.scss';
@observer export default class Clock extends Component {

  @observable time;

  async start(){
    while(true){
      this.time = new Date()
        .toLocaleTimeString('en-US',{hour12: false});
      await sleep(1000);
    }
  }

}
