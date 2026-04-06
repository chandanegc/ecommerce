import { Component } from '@angular/core';
import { Alerts } from '../../../core/service/alerts';

@Component({
  selector: 'alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  constructor(public alerts:Alerts){};
  message:string="";
  status:string="";

  green="green";
  red = "red";
  flag=false;

  notify(msg:string, status:string){
    this.alerts.notify(msg, status);
  }

  get getFlag(){
    return this.alerts.flag();
  }
}
