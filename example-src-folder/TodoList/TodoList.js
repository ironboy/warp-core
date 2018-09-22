@observer class TodoList extends MyComponent {

  @observable list = [];
  @observable newItem = '';
  history = [];

  // Common React pattern - recieve props
  // send them to super
  constructor(props){
    super(props);
    this.getData();
  }

  async getData(){
    this.list = await this.fetch('/api/todo-list-data');
  }

  newItemChange(e){
    this.newItem = e.target.value;
  }
  
  addItem(){
    this.history.push(this.list);
    this.list = [
      ...this.list,
      {todo: this.newItem, done: false}
    ];
    this.newItem = '';
  }

  removeItem(item){
    let index = this.list.indexOf(item);
    let listCopy = [...this.list];
    listCopy.splice(index, 1);
    this.history.push(this.list);
    this.list = listCopy;
  }

  get undoable(){
    return this.history.length !== 0
  }

  undo(){
    if(!this.undoable){ return; }
    this.list = this.history.pop();
  }

}

export default TodoList;
