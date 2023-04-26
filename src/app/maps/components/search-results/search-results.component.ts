import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})




export class SearchResultsComponent {

  public selectedId: string = ''

  constructor(private placesSevice: PlacesService,
              private mapService: MapService){}

  get isloadingPlaces(): boolean {
    return this.placesSevice.isLoadingPlaces
  }

  get places(): Feature[]{
    return this.placesSevice.places
  }
  get previusPlaces(): Feature[]{
    return this.placesSevice.previusPlaces
  }

  flyTo (place: Feature ){
    this.selectedId = place.id
    const  [lng, lat] = place.center
    this.mapService.flyTo([lng, lat])
  }

  getRuta(end:[number, number]){

    if(!this.placesSevice.userLocation) throw new Error('Fallo en geolocalización')

    this.mapService.getRouteBetweenPoints(this.placesSevice.userLocation, end )

    this.placesSevice.clearPlaces()
  }

  previus(){
     this.placesSevice.showPreviusPlaces()
  }
}
