import {Component} from '@angular/core';

@Component({
    selector: 'login',
    template: `<div>
        <h2>Login</h2>
        <input type="text" [(ngModel)]="username" />
        <input type="password" [(ngModel)]="password" />
        <p>{{message}}</p>
        <button (click)="checkCredentials()">Login</button>
    </div>`
})

export class Login {
    username: string;
    password: string;
    timestamp: string;
    message: string = "Enter your email and hit subscribe";

    checkCredentials () {
        var rightUsername: string = "niels";
        var rightPassword: string = "test";

        this.timestamp = new Date().toLocaleTimeString();

        if (this.username === "" || this.password === "") {
            this.message = "Please enter your credentials";
        } else {
            if (this.username === rightUsername && this.password === rightPassword) {
                this.message = this.username + " successfully logged in at " + this.timestamp;
            } else {
                this.message = "Wrong credentials";
            }
        }
    }
}