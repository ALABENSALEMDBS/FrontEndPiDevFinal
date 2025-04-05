import { Buffer } from 'buffer';
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
(window as any).Buffer = Buffer;

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
