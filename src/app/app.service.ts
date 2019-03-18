import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  title = 'Dodger';

  constructor() {
  }

  showNotification(options: NotificationOptions) {
    return new Notification(this.title, options);
  }
}
