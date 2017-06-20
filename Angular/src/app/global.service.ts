export class GlobalService {
data: any;
  constructor(){
    // alert(this.data === undefined)
    if(this.data === undefined){
      this.data = {};
    }
      console.log('Global Service');
  }

}
