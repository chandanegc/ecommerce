import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-suggetion-box',
  imports: [NgIf,NgFor],
  templateUrl: './suggetion-box.html',
  styleUrl: './suggetion-box.css',
})
export class SuggetionBox {
   @Input() items: any[] = [];   // list of suggestions
  @Input() labelKey: string = 'name'; // which field to show


  @Output() select = new EventEmitter<any>();

  onSelect(item: any) {
    this.select.emit(item);
  }
}
