import {Component, OnInit} from '@angular/core';

import {ProxyService} from './proxy.service';
import {AppService} from '../app.service';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnInit {

  constructor(
    private appService: AppService,
    private proxyService: ProxyService
  ) {
  }

  ngOnInit() {
  }

}
