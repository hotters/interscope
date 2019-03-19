import { Component } from '@angular/core';
import { ProxyService } from './proxy.service';
import { ElectronService } from '../electron.service';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent {

  constructor(
    private electron: ElectronService,
    private proxyService: ProxyService
  ) {
    if (this.electron.isElectron) {
      this.proxyService.init();
    }
  }

}
