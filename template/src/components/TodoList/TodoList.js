import './TodoList.scss';

@observer export default class TodoList extends Component {

  @observable itemName = '';
  @observable modalOpen = false;
  nextId = Math.random();

  async start(){
    // connect to the store (defined in utilities/Component)
    let noStore = Object.keys(this.store).length === 0;
    this.createStoreConnectedProperties({
      list: [],
      history: [],
      historyPointer: 0,
      alertClosed: false
    });
    if(noStore){
      // fetch som example data i the store was empty
      this.list = await fetchJSON('/api/todo-list-example-data');
    }
  }

  get confirmModalSettings(){
    let that = this;
    return {
      title: 'Reset all data?',
      okLabel: 'Reset',
      cancel: () => that.modalOpen = false,
      ok: ()=> {
        that.modalOpen = false;
        that.reset();
      }
    }
  }

  listUndone(includeTemp = false){
    return this.list.concat(
      includeTemp && this.itemName ? 
        {id: this.nextId, todo: this.itemName, temp: true} : []
    ).filter(x => !x.done);
  }

  listDone(){
    return this.list.filter(x => x.done);
  }

  myList(item) {
    // return todo if the item is there, otherwise done list
    return item.done ? this.listDone() : this.listUndone();
  }

  get lists() {
    return [
      {name:'Todo', items: this.listUndone(true)},
      {name:'Done', items: this.listDone()}
    ]
  }

  // actions

  addItem(item){
    this.historyEntry();
    this.list.push(item);
  }

  removeItem(item){
    let index = this.list.indexOf(item);
    this.historyEntry();
    this.list.splice(index, 1);
  }

  moveUpItem(item, moveDown = false){
    let list = this.myList(item);
    let itemToSwapWith = list[list.indexOf(item) + (moveDown ? 1 : - 1)];
    let myIndex = this.list.indexOf(item);
    let swapIndex = this.list.indexOf(itemToSwapWith);
    this.historyEntry();
    this.list[swapIndex] = item;
    this.list[myIndex] = itemToSwapWith;
  }

  moveDownItem(item){
    this.moveUpItem(item, true);
  }

  toggleDone(item){
    // done decides if we are filtered
    // to the done list...
    let index = this.list.indexOf(item);
    this.historyEntry();
    // make a copy of the object so that
    // the history keeps the old version
    this.list[index] = {
      ...item,
      done: !item.done
    } 
  }

  historyEntry(){
    // no redoability after new action
    this.history.length = this.historyPointer;
    // save a copy of the list
    this.history.push(this.list.slice());
    // set the history pointer
    this.historyPointer = this.history.length;
  }

  undo(){
    if(!this.canUndo){ return; }
    if(this.historyPointer === this.history.length){
      this.history.push(this.list.slice());
    }
    this.historyPointer--;
    this.list = this.history[this.historyPointer];
  }

  redo(){
    if(!this.canRedo){ return; }
    this.historyPointer++;
    if(this.historyPointer === this.history.length - 1){
      this.list = this.history.pop();
    }
    else {
      this.list = this.history[this.historyPointer];
    }
  }

  reset(){
    for(let key in this.store){ delete this.store[key]; }
    this.start();
  }

  // checks

  canMoveUp(item){
    let list = this.myList(item);
    let index = list.indexOf(item);
    return index >= 1;
  }

  canMoveDown(item){
    let list = this.myList(item);
    let index = list.indexOf(item);
    let last = index >= list.length - 1;
    return index >= 0 && !last;
  }

  get canUndo(){
    return this.historyPointer > 0;
  }

  get canRedo(){
    return this.historyPointer < this.history.length;
  }

  // form events + dismiss alert

  itemNameChange(e){
    this.itemName = e.currentTarget.value;
  }

  addItemFromForm(){
    this.addItem({id: this.nextId, todo: this.itemName});
    this.nextId = Math.random();
    this.itemName = '';
  }
  
}