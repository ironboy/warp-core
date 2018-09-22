<Router>
  <div className="App">
    <header>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome the Warp Core React environment</h1>
      </div>
      <nav>
        <NavLink to="/clock" activeClassName = "active">Clock</NavLink>
        <NavLink to="/todo-list" activeClassName = "active">Todo list</NavLink>
      </nav>
    </header>
    <main>
      { 
        // Sending properties through attributes to component is 
        // simple, example:
        //  <Clock language="en" showSeconds={false}/>

        // Doing the same when a component is on a route (see below)
        // is a little more complex
      }
     
      <Route path="/clock" render={()=><Clock store="this.store"/>}/>
      <Route path="/todo-list" component={TodoList}/>
    </main>
  </div>
</Router>