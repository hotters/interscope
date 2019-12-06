"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const architect_1 = require("@angular-devkit/architect");
const childProcess = require("child_process");
const ts = require("../ts-compile");
const kill = require("tree-kill");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const build_angular_1 = require("@angular-devkit/build-angular");
function electronBuilder(electronArgs, context) {
    const ngBuild = serveAngular(electronArgs, context).pipe(operators_1.materialize(), operators_1.share());
    const firstBuild = ngBuild.pipe(operators_1.first(), operators_1.map(({ value, error }) => {
        if (!value) {
            throw error;
        }
        electraLog('Run Electron with config:', '\n', electronArgs);
        return value.baseUrl;
    }), operators_1.tap(baseUrl => electraLog(`Electron is watching ${baseUrl}. Start building...`)), operators_1.switchMap(baseUrl => watchElectron(electronArgs, context).pipe(operators_1.tap(() => electraLog('Build finished. Start app...')), operators_1.mergeMap(runElectron.call(this, electronArgs, baseUrl, context)))), operators_1.tap(code => electraLog(`Process end with exit code ${code}`)));
    return rxjs_1.merge(firstBuild, ngBuild).pipe(operators_1.dematerialize(), operators_1.map(code => ({ success: code === 0 })));
}
function serveAngular(electronArgs, context) {
    return build_angular_1.executeDevServerBuilder(electronArgs, context);
}
function watchElectron(electronArgs, { workspaceRoot }) {
    return ts.watch(workspaceRoot + '/projects/electron', 'tsconfig.electron.json');
}
function runElectron(electronArgs, baseUrl, context) {
    const options = {
        stdio: ['pipe', 'inherit', 'inherit'],
        env: {
            ELECTRON_URL: baseUrl
        }
    };
    const el = require('electron');
    const electron = 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'; // TODO change to dynamic
    const projectDir = context.workspaceRoot + '/projects/electron'; // TODO change to dynamic
    let pid = null;
    return () => new rxjs_1.Observable(subscriber => {
        const spawn = () => {
            const electronProcess = childProcess.spawn(el, [projectDir], options);
            electronProcess.on('close', code => {
                if (code !== null) {
                    subscriber.next(code);
                    subscriber.complete();
                }
            });
            pid = electronProcess.pid;
        };
        if (pid) {
            kill(pid, 'SIGKILL', e => !e && spawn());
        }
        else {
            spawn();
        }
        return () => {
            kill(pid, 'SIGKILL');
            subscriber.complete();
        };
    }).pipe(operators_1.materialize());
}
function electraLog(...args) {
    console.log('[electron-platform]', ...args);
}
exports.default = architect_1.createBuilder(electronBuilder);
//# sourceMappingURL=index.js.map