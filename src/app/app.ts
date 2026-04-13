import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { AlertComponent } from './shared/components/alert/alert.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { Functions } from './core/services/functions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, AlertComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  functions = inject(Functions);
  ngOnInit() {
    this.functions.getCurrentLocation().subscribe({
      next: (location) => console.log('Current Location:', location),
      error: (error) => console.error('Error getting location:', error)
    });
  } 

}
