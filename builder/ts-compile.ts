import * as ts from 'typescript';
import { Observable } from 'rxjs';

export function watch(path, configName = 'tsconfig.json'): Observable<null> {
  return new Observable(subscriber => {
    const configPath = ts.findConfigFile(
      path,
      ts.sys.fileExists,
      configName
    );
    if (!configPath) {
      subscriber.error(new Error('Could not find a valid "tsconfig.json".'));
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
      configPath,
      {},
      ts.sys,
      createProgram,
      (error) => {
        subscriber.error(error);
        reportDiagnostic(error);
      },
      reportWatchStatusChanged
    );

    const origCreateProgram = host.createProgram;
    host.createProgram = (
      rootNames: ReadonlyArray<string>,
      options,
      programHost,
      oldProgram
    ) => {
      console.log('[ts] Start compiling...');
      return origCreateProgram(rootNames, options, programHost, oldProgram);
    };
    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = program => {
      subscriber.next(null);
      origPostProgramCreate(program);
      console.log('[ts] Compiled successfully.');
    };

    ts.createWatchProgram(host);

    return () => void 0;
  });
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    'Error',
    diagnostic.code,
    ':',
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine()
    )
  );
}

function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  console.log('[tsc]', ts.formatDiagnostic(diagnostic, formatHost));
}
