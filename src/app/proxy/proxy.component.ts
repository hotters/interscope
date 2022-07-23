import { Component } from "@angular/core";
import { ElectronService } from "../electron.service";
import { ProxyService } from "./proxy.service";

@Component({
  selector: "app-proxy",
  templateUrl: "./proxy.component.html",
  styleUrls: ["./proxy.component.scss"],
})
export class ProxyComponent {
  constructor(
    private electron: ElectronService,
    private proxyService: ProxyService
  ) {
    console.log("PROXY");
    if (this.electron.isElectron) {
      this.proxyService.init();
      // this.proxyService.mock();
    }
  }
}
