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
var SubscribeNewsLetter = (function () {
    function SubscribeNewsLetter() {
        this.email = "niels@bril.com";
        this.message = "Enter your email and hit subscribe";
    }
    SubscribeNewsLetter.prototype.registerEmail = function () {
        this.message = "Thank you for subscribing (" + this.email + ")";
        this.subscribedDate = new Date().toLocaleTimeString();
    };
    return SubscribeNewsLetter;
}());
SubscribeNewsLetter = __decorate([
    core_1.Component({
        selector: 'subscribe',
        template: "<div>\n        <h2>Register</h2>\n        <input type=\"email\" [(ngModel)]=\"email\" />\n        <p>{{message}}</p>\n        <p>Email: {{email}}</p>\n        <p>Subscribed on: {{subscribedDate}}</p>\n        <button (click)=\"registerEmail()\">Subscribe</button>\n    </div>"
    }),
    __metadata("design:paramtypes", [])
], SubscribeNewsLetter);
exports.SubscribeNewsLetter = SubscribeNewsLetter;
//# sourceMappingURL=Subscribe.js.map