import { Schema } from '@angular-devkit/build-angular/src/dev-server/schema';
import { json } from '@angular-devkit/core';

export type ElectronSchema = json.JsonObject &  Omit<Schema, 'hmr' | 'hmrWarning'> & {webpackConfig: string};
