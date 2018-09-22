@observer class Clock extends MyComponent {

  @observable time;

  componentDidMount(){
    this.runClock();
  }

  async runClock(){
    while(true){
      this.time = new Date().toLocaleTimeString();
      await this.sleep(1000);
    }
  }

}

export default Clock;
