
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [ number, number]
  public isLoadingPlaces: boolean = false;
  public places: Feature[]=[]

  get isUserLoationReady():boolean{
    return !!this.userLocation
  }

  constructor( private placesapi: PlacesApiClient) {
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

   });

  }


}
