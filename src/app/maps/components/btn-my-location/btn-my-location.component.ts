import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(private mapService: MapService,
              private placesService: PlacesService){}

  goToMyLocation(){

    if(!this.placesService.isUserLoationReady){
       alert('No hay ubicación disponible')
       throw Error('No hay ubicación disponible')
    }
    if(!this.mapService.isMapReady){
      alert('No hay Mapa disponible')
      throw Error('No hay Mapa disponible')
    }

   this.mapService.flyTo(this.placesService.userLocation!)

  }
}
