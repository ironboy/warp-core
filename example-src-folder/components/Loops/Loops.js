export default class Loops extends Component {
 
  one(){
    this.arr = [
      {name: 'Cecilia', id: 1},
      {name: 'Dan', id: 2},
      {name: 'Eve', id: 3}
    ];
    let result = '';
    for(let item of this.arr){
      result += `<li>${item.name}</li>`;
    }
    return result;
  }
  two() {
    return this.arr.map(item => `<li>${item.name}</li>`).join('');
  }
  start(){
    console.log(this.one());
    console.log(this.two());
  }
}