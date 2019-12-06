import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import * as ts from '../ts-compile';
import * as kill from 'tree-kill';
import { merge, Notification, Observable } from 'rxjs';
import { dematerialize, first, map, materialize, mergeMap, share, switchMap, tap } from 'rxjs/operators';
import { ElectronSchema } from '../schema';
import { DevServerBuilderOutput, executeDevServerBuilder } from '@angular-devkit/build-angular';


function electronBuilder(electronArgs: ElectronSchema, context: BuilderContext): Observable<{ success: boolean }> {
  const ngBuild = serveAngular(electronArgs, context).pipe(
    materialize(),
    share()
  );
  const firstBuild = ngBuild.pipe(
    first(),
    map(({value, error}: Notification<DevServerBuilderOutput>) => {
      if (!value) {
        throw error;
      }
      electraLog('Run Electron with config:', '\n', electronArgs);
      return value.baseUrl;
    }),
    tap(baseUrl => electraLog(`Electron is watching ${baseUrl}. Start building...`)),
    switchMap(baseUrl => watchElectron(electronArgs, context).pipe(
      tap(() => electraLog('Build finished. Start app...')),
      mergeMap(runElectron.call(this, electronArgs, baseUrl, context))
    )),
    tap(code => electraLog(`Process end with exit code ${code}`))
  );
  return merge(
    firstBuild,
    ngBuild
  ).pipe(
    dematerialize(),
    map(code => ({success: code === 0}))
  );
}

function serveAngular(electronArgs, context): any {
  return executeDevServerBuilder(electronArgs, context);
}

function watchElectron(electronArgs, {workspaceRoot}): Observable<any> {
  return ts.watch(workspaceRoot + '/projects/electron', 'tsconfig.electron.json');
}

function runElectron(electronArgs, baseUrl: string, context: BuilderContext): () => Observable<any> {
  const options: childProcess.SpawnOptions = {
    stdio: ['pipe', 'inherit', 'inherit'],
    env: {
      ELECTRON_URL: baseUrl
    }
  };
  const el = require('electron');

  const electron = 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'; // TODO change to dynamic
  const projectDir = context.workspaceRoot + '/projects/electron'; // TODO change to dynamic
  let pid = null;
  return () => new Observable(subscriber => {
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
    } else {
      spawn();
    }
    return () => {
      kill(pid, 'SIGKILL');
      subscriber.complete();
    };
  }).pipe(materialize());
}


function electraLog(...args) {
  console.log('[electron-platform]', ...args);
}

export default createBuilder(electronBuilder);
