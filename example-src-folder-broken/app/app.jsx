<div className="App">

<nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="##">Navbar</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="##">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="##">Link</a>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="##" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <a className="dropdown-item" href="##">Action</a>
          <a className="dropdown-item" href="##">Another action</a>
          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="##">Something else here</a>
        </div>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled" href="##">Disabled</a>
      </li>
    </ul>
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>



  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1 className="App-title">Welcome to Warp-Core</h1>
  </header>
  <p className="App-intro">
    To get started, edit <code>src/app/app.js</code> and save to reload.
  </p>
  <ul className="names">
    {(this.persons || []).map((person, i) =>
      <li key={i}  onClick={e => this.removePerson(person)}>{person.name}</li>
    )}
  </ul>
  <p>
    {this.time}
  </p>
  <div className="clock">
      <div className="hand hour-hand" style={(this.rotate || {}).hours}></div>
      <div className="hand minute-hand" style={(this.rotate || {}).minutes}></div>
      <div className="hand second-hand" style={(this.rotate || {}).seconds}></div>
      <div className="middle"></div>
  </div>

<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Launch demo modal
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
</div>