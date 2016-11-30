import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SubscribeNewsLetter } from '../components/Subscribe';
import { Login } from '../components/Login';

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  declarations: [ SubscribeNewsLetter, Login ],
  bootstrap: [ SubscribeNewsLetter, Login ]
})

export class AppModule { }