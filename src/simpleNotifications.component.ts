import {Component, EventEmitter} from "@angular/core"
import {Notification} from "./notification"
import {NotificationsService} from "./notifications.service"
import {NotificationComponent} from "./notification.component"


@Component({
    selector: "simple-notifications",
    directives: [NotificationComponent],
    inputs: ["options"],
    outputs: ["onCreate", "onDestroy"],
    template: `
        <div class="simple-notification-wrapper">
            <simple-notification
                *ngFor="let a of notifications; let i = index"
                [item]="a"
                [timeOut]="timeOut"
                [clickToClose]="clickToClose"
                [maxLength]="maxLength"
                [showProgressBar]="showProgressBar"
                [pauseOnHover]="pauseOnHover"
                [theClass]="theClass"
                [position]="i">

            </simple-notification>
        </div>
    `,
    styles: [`
        .simple-notification-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            z-index: 1000;
        }
    `]
})

export class SimpleNotificationsComponent {
    constructor(
        private _service: NotificationsService
    ) {}


    public notifications: Notification[] = [];
    public options: any;

    private listener: any;

    // Received values
    private lastOnBottom: boolean = true;
    private maxStack: number = 8;
    private preventLastDuplicates: any = false;
    private preventDuplicates: boolean = false;

    // Sent values
    private timeOut: number = 0;
    private maxLength: number = 0;
    private clickToClose: boolean = true;
    private showProgressBar: boolean = true;
    private pauseOnHover: boolean = true;
    private theClass: string;
    private expand: string;

    private lastNotificationCreated: Notification;

    // Outputs
    private onCreate = new EventEmitter();
    private onDestroy = new EventEmitter();

    ngOnInit() {
        // Listen for changes in the service
        this.listener = this._service.getChangeEmitter()
            .subscribe(item => {


                switch (item.command) {
                    case "cleanAll":
                        this.notifications = [];
                        break;

                    case "clean":
                        this.cleanSingle(item.id);
                        break;

                    case "set":
                        if (item.add) this.add(item.notification);
                        else this.defaultBehavior(item);
                        break;

                    default:
                        this.defaultBehavior(item);
                        break;
                }
            });

        this.attachChanges();
    }

    // Default behavior on event
    defaultBehavior(value) {
        this.notifications.splice(this.notifications.indexOf(value.notification), 1);
        this.onDestroy.emit(this.buildEmit(value.notification, false));
    }


    // Add the new notification to the notification array
    add(item) {
        item.createdOn = new Date();
        item.id = Math.random().toString(36).substring(3);

        let toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;

        // Save this as the last created notification
        this.lastNotificationCreated = item;

        if (!toBlock) {
            // Check if the notification should be added at the start or the end of the array
            if (this.lastOnBottom) {
                if (this.notifications.length >= this.maxStack) this.notifications.splice(0, 1);
                this.notifications.push(item);
            } else {
                if (this.notifications.length >= this.maxStack) this.notifications.splice(this.notifications.length - 1, 1);
                this.notifications.splice(0, 0, item);
            }

            this.onCreate.emit(this.buildEmit(item, true));
        }
    }

    // Check if notifications should be prevented
    block(item) {

        if (this.preventDuplicates && this.notifications.length > 0)
            for (let i = 0; i < this.notifications.length; i++)
                if (this.notifications[i].type === item.type && this.notifications[i].title === item.title && this.notifications[i].content === item.content) return true;

        if (this.preventLastDuplicates) {

            let comp1: any = item,
                comp2: any;

            if (this.preventLastDuplicates === "visible" && this.notifications.length > 0) {
                if (this.lastOnBottom) comp2 = this.notifications[this.notifications.length - 1];
                else comp2 = this.notifications[0];
            }

            else if (this.preventLastDuplicates === "all" && this.lastNotificationCreated) comp2 = this.lastNotificationCreated;


            else return false;

            // Remove creation dates and ids
            delete comp1.createdOn;
            delete comp1.id;
            delete comp2.createdOn;
            delete comp2.id;

            comp1 = JSON.stringify(comp1);
            comp2 = JSON.stringify(comp2);

            return comp1 === comp2;

        }

        return false
    }

    // Attach all the changes received in the options object
    attachChanges() {
        Object.keys(this.options).forEach(a => this[a] = this.options[a])
    }

    buildEmit(notification: Notification, to: boolean) {
        let toEmit = {
            createdOn: notification.createdOn,
            type: notification.type,
            id: notification.id
        };

        if (notification.html) toEmit["html"] = notification.html;

        else {
            toEmit["title"] = notification.title;
            toEmit["content"] = notification.content;
        }

        if (!to) toEmit["destroyedOn"] = new Date();

        return toEmit;
    }

    cleanSingle(id: string) {
        let indexOfDelete: number,
            doDelete: boolean = false;

        this.notifications.forEach((a, idx) => {
            if (a.id === id) {
                indexOfDelete = idx;
                doDelete = true;
            }
        });

        if (doDelete) this.notifications.splice(indexOfDelete, 1);
    }

    ngOnDestroy() { if (this.listener) this.listener.unsubscribe() }
}
