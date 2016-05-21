import {Component, ViewEncapsulation} from "@angular/core"
import {Notification} from "./notification"
import {NotificationsService} from "./notifications.service"
import {MaxPipe} from "./max.pipe"
import {Icons} from "./icons"

@Component({
    selector: "simple-notification",

    inputs: [
        "item",
        "timeOut",
        "position",
        "clickToClose",
        "maxLength",
        "showProgressBar",
        "pauseOnHover",
        "theClass"
    ],
    pipes: [MaxPipe],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="simple-notification"
            (click)="removeSelf()"
            [class]="theClass"
            
            [ngClass]="{
                alert: item.type == 'alert', 
                error: item.type == 'error', 
                success: item.type == 'success', 
                info: item.type == 'info',
                bare: item.type == 'bare'
                }"
                
            (mouseenter)="onEnter()"
            (mouseleave)="onLeave()">

            <div *ngIf="!item.html">
                <div class="title">{{item.title}}</div>
                <div class="content">{{item.content | max:maxLength}}</div>
                <div *ngIf="item.type !== 'bare'" [innerHTML]="icons[item.type]"></div>
            </div>
            <div *ngIf="item.html" [innerHTML]="item.html"></div>

            <div class="progress" *ngIf="showProgressBar">
                <span [ngStyle]="{'width': progressWidth + '%'}"></span>
            </div>

        </div>
    `,
    styles: [`
        .simple-notification {
            width: 100%;
            padding: 10px 20px;
            box-sizing: border-box;
            position: relative;
            float: left;
            margin-bottom: 10px;
            color: #fff;
            cursor: pointer;
            transition: all 0.5s;
        }

        .simple-notification .title {
            margin: 0;
            padding: 0;
            line-height: 30px;
            font-size: 20px;
        }

        .simple-notification svg {
            position: absolute;
            box-sizing: border-box;
            top: 0;
            right: 0;
            width: auto;
            height: 70px;
            padding: 10px;
            fill: #fff;
        }

        .simple-notification .content {
            margin: 0;
            font-size: 16px;
            padding: 0 50px 0 0;
            line-height: 20px;
        }

        .simple-notification.error { background: #F44336; }
        .simple-notification.success { background: #8BC34A; }
        .simple-notification.alert { background: #ffdb5b; }
        .simple-notification.info { background: #03A9F4; }

        .simple-notification .progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
        }

        .simple-notification .progress span {
            float: left;
            height: 100%;
        }

        .simple-notification.success .progress span { background: #689F38; }
        .simple-notification.error .progress span { background: #D32F2F; }
        .simple-notification.alert .progress span { background: #edc242; }
        .simple-notification.info .progress span { background: #0288D1; }
        .simple-notification.bare .progress span { background: #ccc; }
    `]
})

export class NotificationComponent {
    constructor(
        private _service: NotificationsService
    ) {}

    public icons: any = Icons;

    ////// Inputs
    public item: Notification;
    public maxLength: number;
    public showProgressBar: boolean;
    public theClass: string;
    public theHtml: any;

    public overrides: any;
    private timeOut: number;
    private position: number;
    private clickToClose: boolean;
    private pauseOnHover: boolean;

    ////// Locals

    // Progress bar variables
    public progressWidth: number = 0;
    private stopTime: boolean = false;
    private timer: any;
    private steps: number;
    private speed: number;
    private count: number = 0;
    private start: any;
    private diff: any;

    private instance = () => {
        this.diff = (new Date().getTime() - this.start) - (this.count * this.speed);
        if (this.count++ === this.steps) this._service.set(this.item, false);
        else if (!this.stopTime) {
            if (this.showProgressBar) this.progressWidth += 100 / this.steps;
            this.timer = setTimeout(this.instance, (this.speed - this.diff));
        }
    };

    ngOnInit() {
        if (this.item.override) this.attachOverrides();
        if (this.timeOut !== 0) this.startTimeOut();
    }

    startTimeOut() {
        this.steps = this.timeOut / 10;
        this.speed = this.timeOut / this.steps;
        this.start = new Date().getTime();
        this.timer = setTimeout(this.instance, this.speed);
    }

    onEnter() {
        if (this.pauseOnHover) this.stopTime = true
    }

    onLeave() {
        if (this.pauseOnHover) {
            this.stopTime = false;
            setTimeout(this.instance, (this.speed - this.diff));
        }
    }

    setPosition() { return this.position !== 0 ? this.position * 90 : 0; }
    removeSelf() { if (this.clickToClose) this._service.set(this.item, false); }


    // Attach all the overrides
    attachOverrides() {
        Object.keys(this.item.override).forEach(a => this[a] = this.item.override[a])
    }

    ngOnDestroy() { clearTimeout(this.timer) }
}