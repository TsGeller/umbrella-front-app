import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { appConfig } from './app/app.config';  // ← Importez

bootstrapApplication(App, appConfig)  // ← Utilisez directement
  .catch((err) => console.error(err));