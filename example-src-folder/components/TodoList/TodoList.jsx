<div className="TodoList container">

  {/* A quote */}
  <div className="row">
    <div className="col-12">
    <Alert isOpen={!this.alertClosed} toggle={() => this.alertClosed = true} color="primary" className="text-center mt-4 light-blue-bg">
     <i>»&nbsp;The frameworks are lovely, dark and deep.<br />But I have todo list code to compare and miles to go before I sleep.<br />And miles to go before I sleep.&nbsp;«</i>
    </Alert>
    </div>
  </div>

  {/* The lists */}
  <div className="row">
    {this.lists.map((list, i) =>
      !list.items.length ? null : <div className="col-12 col-lg-6" key={i}>
        <div className="list-holder mt-4" key={i}>
          <h3>{list.name}</h3>
          <ul className="list-group">
            {list.items.map((item) =>  
              <li className="list-group-item" key={item.id}>
                <span className="name">{item.todo}</span>
                {/* Buttons (on every item excepts temporary) */}
                {item.temp ? null :
                  <span>
                    <ButtonGroup className="btn-group-sm float-right">
                      <Button className="move-up" color="light" onClick={e => this.moveUpItem(item)} disabled={!this.canMoveUp(item)} />
                      <Button className="move-down" color="light" onClick={e => this.moveDownItem(item)} disabled={!this.canMoveDown(item)} />
                      <Button className={list.name === 'Todo' ? 'to-done' : 'to-todo'} color="light" onClick={e => this.toggleDone(item)} />
                      <Button className="remove" color="light" onClick={e => this.removeItem(item)} />
                    </ButtonGroup>
                  </span>
                }
              </li>
            )}
          </ul>
        </div>
      </div>
    )}
  </div>
  
  {/* Input + undo/redo */}
  <div className="row mt-5">
    <div className="col-12 col-md-6 order-2 order-md-1 mt-3 mt-md-0">
      <ButtonGroup className="undo-redo">
        <Button className="undo" color="light" disabled={!this.canUndo} onClick={e => this.undo()}>Undo</Button>
        <Button className="reset" color="light" onClick={e => this.modalOpen = true}>Reset</Button>
        <Button className="redo" color="light" disabled={!this.canRedo} onClick={e => this.redo()}>Redo</Button>
      </ButtonGroup>
    </div>
    <div className="col-12 col-md-6 order-1 order-md-2">
      <InputGroup>  
        <Input placeholder="Add a new item" value={this.itemName} onChange={e => this.itemNameChange(e)} onKeyPress={e => e.key === 'Enter' && this.addItemFromForm()}/>
        <InputGroupAddon addonType="append">
          <Button color="outline-primary" onClick={e => this.addItemFromForm()}>Add item</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </div>
  <ConfirmModal open={this.modalOpen} {...this.confirmModalSettings}>
    <p>Do you want to reset the data to some example data from the server?</p>
    <p><b>Note:</b> This will erase all your data and your undo/redo history.</p>
  </ConfirmModal>
</div>
