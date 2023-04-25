import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl';

Mapboxgl.accessToken='pk.eyJ1IjoiamFlbGVzcGlub3NhIiwiYSI6ImNsZ3Z5MWJmejA4ZDQzZXBsajl2ajI5ZmYifQ.vX5bfVwOu94jzV8B0HuD0A'

if (!navigator.geolocation){
  alert('Navegador no compatible con Geolocalización')
  throw new Error('Navegador no compatible con Geolocalización')
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
