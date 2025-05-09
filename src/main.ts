import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as L from 'leaflet';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  // le dice a Leaflet dónde están las imágenes en producción
L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet-images/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet-images/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet-images/marker-shadow.png'
});

