import { Injectable, Query, signal } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Data {
  suggestion = signal<any[]>([]);
}
