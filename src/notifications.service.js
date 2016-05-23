"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var NotificationsService = (function () {
    function NotificationsService() {
        this.emiter = new core_1.EventEmitter();
    }
    NotificationsService.prototype.set = function (notification, to) { this.emiter.emit({ command: "set", notification: notification, add: to }); };
    ;
    NotificationsService.prototype.getChangeEmitter = function () { return this.emiter; };
    //// Access methods
    NotificationsService.prototype.success = function (title, content, override) {
        this.set({ title: title, content: content, type: "success", override: override }, true);
    };
    NotificationsService.prototype.error = function (title, content, override) {
        this.set({ title: title, content: content, type: "error", override: override }, true);
    };
    NotificationsService.prototype.alert = function (title, content, override) {
        this.set({ title: title, content: content, type: "alert", override: override }, true);
    };
    NotificationsService.prototype.info = function (title, content, override) {
        this.set({ title: title, content: content, type: "info", override: override }, true);
    };
    NotificationsService.prototype.bare = function (title, content, override) {
        this.set({ title: title, content: content, type: "bare", override: override }, true);
    };
    // With type method
    NotificationsService.prototype.create = function (title, content, type, override) { this.set({ title: title, content: content, type: type, override: override }, true); };
    // HTML Notification method
    NotificationsService.prototype.html = function (html, type, override) { this.set({ html: html, type: type, override: override, title: null, content: null }, true); };
    // Remove all notifications method
    NotificationsService.prototype.remove = function (id) {
        if (id)
            this.emiter.emit({ command: "clean", id: id });
        else
            this.emiter.emit({ command: "cleanAll" });
    };
    NotificationsService = __decorate([
        core_1.Injectable()
    ], NotificationsService);
    return NotificationsService;
}());
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map