"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const rxjs_1 = require("rxjs");
function watch(path, configName = 'tsconfig.electron.json') {
    return new rxjs_1.Observable(subscriber => {
        const configPath = ts.findConfigFile(path, ts.sys.fileExists, configName);
        if (!configPath) {
            subscriber.error(new Error('Could not find a valid "tsconfig.json".'));
        }
        const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
        const host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, (error) => {
            subscriber.error(error);
            reportDiagnostic(error);
        }, reportWatchStatusChanged);
        const origCreateProgram = host.createProgram;
        host.createProgram = (rootNames, options, programHost, oldProgram) => {
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
exports.watch = watch;
const formatHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
function reportDiagnostic(diagnostic) {
    console.error('Error', diagnostic.code, ':', ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
}
function reportWatchStatusChanged(diagnostic) {
    console.log('[tsc]', ts.formatDiagnostic(diagnostic, formatHost));
}
//# sourceMappingURL=ts-compile.js.map