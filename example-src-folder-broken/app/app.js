import './app.scss';
import React from 'react';
import Component from '../component/component.js';
import logo from './images/logo.svg';

export default class App extends Component {

  componentDidMount(){
    this.getData();
    this.clock();
  }

  async getData(){
    this.persons = await this.fetch('/json/data.json');
    this.update();
  }

  async clock(){
    while (true){
      let now = new Date();
      this.time = now.toLocaleTimeString('sv-SE');
      let t = { 
        hours: now.getHours() - (now.getHours() >= 12 ? 12 : 0),
        minutes: now.getMinutes(),
        seconds: now.getSeconds() + now.getMilliseconds() / 1000
      };
      t.minutes += t.seconds/60;
      t.hours += t.minutes/60;
      this.rotate = {
        hours: {transform: `rotate(${360 * t.hours/12}deg)`},
        minutes: {transform: `rotate(${360 * t.minutes/60}deg)`},
        seconds: {transform: `rotate(${360 * t.seconds/60}deg)`}
      };
      this.update();
      await this.sleep(10);
    }
  }

  removePerson(person){
    this.persons = this.persons.filter(x => x != person);
    this.persons.splice(this.persons.indexOf(person), 1);
    this.update();
  }

}