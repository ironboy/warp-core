import './Clock.scss';
@observer export default class Clock extends Component {

  @observable time;

  async start(){
    this.runClock = true;
    while(this.runClock){
      console.log('well')
      this.time = new Date()
        .toLocaleTimeString('en-US',{hour12: false});
      await sleep(1000);
    }
  }

  componentWillUnmount(){
    this.runClock = false;
  }

}
