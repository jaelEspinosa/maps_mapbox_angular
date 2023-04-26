
import { Injectable } from '@angular/core';

import { PlacesApiClient } from '../api';
import { MapService } from './map.service';
import { Feature, PlacesResponse } from '../interfaces/places';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [ number, number]
  public isLoadingPlaces: boolean = false;
  public places: Feature[]=[]
  public previusPlaces: Feature[]=[]

  get isUserLoationReady():boolean{
    return !!this.userLocation
  }

  constructor( private placesapi: PlacesApiClient,
               private mapService: MapService) {
    this.getUserLocation();
   }

  getUserLocation():Promise<[number,number]> {
    return new Promise( (resolve, reject) =>{
       navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude]
          resolve (this.userLocation)
        },
        (err) =>{
          alert ('No se pudo obtener la geolocalización')
          console.log(err);
          reject();
        }
       );
    });
  }

  getPlacesByQuery( query: string = ''){
    if (query === ''){
      this.places = [];
      this.isLoadingPlaces=false;
      return;
    }

    if (!this.userLocation) {
      alert('Fallo al obtener ubicación')
      return
    }

    this.isLoadingPlaces=true
   return  this.placesapi.get<PlacesResponse>(`/${ query }.json`, {
    params:{
      proximity: this.userLocation?.join(',')
    }
   })
   .subscribe(resp => {
      this.places = resp.features
      this.isLoadingPlaces=false
      this.mapService.createMarkersFromPlaces( this.places, this.userLocation! )

   });

  }
//limpiar las places

clearPlaces(){
  this.previusPlaces= this.places;
  this.places = [];
 }

showPreviusPlaces(){
  this.places = this.previusPlaces;
  this.previusPlaces = []
}

}
