import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';



@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!:ElementRef

  constructor(private placesService:PlacesService,
              private mapService: MapService){}


  ngAfterViewInit() {

    if(!this.placesService.userLocation) throw new Error('Error en geolocation')

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 15, // starting zoom
      });

    const popup = new Popup()
      .setHTML(`
         <h6>Aquí estoy</h6>
         <span>${this.placesService.userLocation}</span>
      `);

    new Marker({color: 'red'})
      .setLngLat( this.placesService.userLocation)
      .setPopup( popup )
      .addTo( map )

    this.mapService.setMap( map )
  }



}


