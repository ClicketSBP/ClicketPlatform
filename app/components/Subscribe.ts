import {Component} from '@angular/core';

@Component({
    selector: 'subscribe',
    template: `<div>
        <h2>Register</h2>
        <input type="email" [(ngModel)]="email" />
        <p>{{message}}</p>
        <p>Email: {{email}}</p>
        <p>Subscribed on: {{subscribedDate}}</p>
        <button (click)="registerEmail()">Subscribe</button>
    </div>`
})

export class SubscribeNewsLetter {
    email: string = "niels@bril.com"
    message: string = "Enter your email and hit subscribe";
    subscribedDate: string;
    
    registerEmail () {
        this.message = "Thank you for subscribing (" + this.email + ")";
        this.subscribedDate = new Date().toLocaleTimeString();
    }
}