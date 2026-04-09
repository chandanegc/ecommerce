import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Suggestion } from '../../utils/constants';

@Component({
  selector: 'app-suggetion-box',
  imports: [NgIf,NgFor],
  templateUrl: './suggetion-box.html',
  styleUrl: './suggetion-box.css',
})
export class SuggetionBox {
   @Input() items: any[] = []; 
  @Input() labelKey: string = 'name'; 
  selectLocation =signal<Suggestion>({} as Suggestion)


  @Output() select = new EventEmitter<any>();

  onSelect(item: any) {
    this.select.emit(item);
    this.selectLocation.set(item);
  }
}
