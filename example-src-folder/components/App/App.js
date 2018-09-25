import './App.scss';
@observer export default class App extends Component {

  @observable style = {opacity: 0};
  
  async start(){
    // avoid FOUC by waiting for styles to load
    // and then fade in the app
    while(this.style.opacity < 1){
      await sleep(20);
      let ok = $('body').css('font-family').length > 10;
      this.style.opacity += ok ? .03 : 0;
    }
    // no focusing of buttons (the only jQuery used in our code)
    $(document).on('focus', 'button', function(){ $(this).blur(); })
  }

}