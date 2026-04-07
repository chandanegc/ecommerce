import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-box',
  imports: [NgClass],
  templateUrl: './input-box.html',
  styleUrl: './input-box.css',
})
export class InputBox {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';

  @Input() variant: 'default' | 'search' | 'error' | 'rounded' = 'default';

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
