<div>
  <h3>Todo now:</h3>
  <ul>
    {
      // React likes unique keys for every
      // imem in a list/from an array
      // Ideally use a unique id from a DB.
      // As a last resort use index as key.
    }
    {this.list.map((item, i) =>  
      <li key={i}>
        {item.todo}
        <button onClick={e => this.removeItem(item)}><span role="img" aria-label="remove">👎</span></button>
      </li>
    )}
  </ul>
  <input type="text" placeholder="Add a new item" value={this.newItem} onChange={e => this.newItemChange(e)}/>
  <button onClick={e => this.addItem()}>Add item</button>
  <button disabled={!this.undoable} onClick={e => this.undo()}>Undo</button>
</div>