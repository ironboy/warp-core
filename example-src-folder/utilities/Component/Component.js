export default class Component extends ReactComponent {

  // Create a global store (or read it from localStorage)
  @observable static store = (()=>{
    let s = {};
    try { s = JSON.parse(localStorage.store); } catch(e){}
    return s;
  })();

  // A shared space for cross component sharing
  @observable static shared = {};

  constructor(props){
    super(props);
    
    // Create a key in the global store for each class
    let cname = this.constructor.name;
    Component.store[cname] = Component.store[cname] || {};
    
    // Let all the global store be reachable as this.stores
    // and specific store as this.store
    this.stores = Component.store;
    this.store = Component.store[cname];
    
    // Share this.shared too
    this.shared = Component.shared;

    // React to changes in the store and save to localStorage
    reaction(
      () => toJS(Component.store),
      () => {
        // Adding a little bit of throttling with set/clearTimeout
        clearTimeout(Component.saveTimeout);
        Component.saveTimeout = setTimeout(() => {
          localStorage.store = JSON.stringify(toJS(Component.store));
        }, 10);
      },
    );

    // If a method named start exists then call it
    // (more convinient than having to write a constructor in the class)
    typeof this.start === 'function' && this.start();
  }

  // A convenient way to connect properties to the store
  createStoreConnectedProperties(settings){
    for(let setting in settings){
      (()=>{
        let key = setting;
        let _default = settings[key];
        this.store[key] = this.store[key] || _default;
        Object.defineProperty(this, key, {
          set: x => this.store[key] = x,
          get: () => this.store[key],
          configurable: true
        });
      })();
    }
  }

}