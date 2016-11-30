"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Login = (function () {
    function Login() {
        this.message = "Enter your email and hit subscribe";
    }
    Login.prototype.checkCredentials = function () {
        var rightUsername = "niels";
        var rightPassword = "test";
        this.timestamp = new Date().toLocaleTimeString();
        if (this.username === "" || this.password === "") {
            this.message = "Please enter your credentials";
        }
        else {
            if (this.username === rightUsername && this.password === rightPassword) {
                this.message = this.username + " successfully logged in at " + this.timestamp;
            }
            else {
                this.message = "Wrong credentials";
            }
        }
    };
    return Login;
}());
Login = __decorate([
    core_1.Component({
        selector: 'login',
        template: "<div>\n        <h2>Login</h2>\n        <input type=\"text\" [(ngModel)]=\"username\" />\n        <input type=\"password\" [(ngModel)]=\"password\" />\n        <p>{{message}}</p>\n        <button (click)=\"checkCredentials()\">Login</button>\n    </div>"
    }),
    __metadata("design:paramtypes", [])
], Login);
exports.Login = Login;
//# sourceMappingURL=Login.js.map