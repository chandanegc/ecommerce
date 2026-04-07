import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
 @Input() label: string = 'Button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
}
