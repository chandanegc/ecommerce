import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alerts {
  message:string="";
  status:string="";

  green="green";
  red = "red";
  flag=signal(false);

  notify(msg:string, status:string){
    this.message =msg;
    this.status = status;
    this.flag.set(true);
    setTimeout(() => {
       this.flag.set(false);
    }, 1000);

     console.log(this.flag)
  }
}
