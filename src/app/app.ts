import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { AlertComponent } from './shared/components/alert/alert.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { Button } from './shared/components/button/button';
import { InputBox } from './shared/components/input-box/input-box';
import { SuggetionBox } from './shared/components/suggetion-box/suggetion-box';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, AlertComponent, LoaderComponent, Button, InputBox,SuggetionBox],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
