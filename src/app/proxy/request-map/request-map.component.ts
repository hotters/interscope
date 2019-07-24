import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-map',
  templateUrl: './request-map.component.html',
  styleUrls: ['./request-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestMapComponent implements OnInit {

  hosts = localStorage;

  constructor() {
  }

  ngOnInit() {
  }


  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string) {
    localStorage[key] = value;
  }

}
