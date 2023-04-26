import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { Directions, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map
  private markers: Marker[] = []

  public styleMap: string = 'mapbox://styles/mapbox/streets-v12'

  get isMapReady(){
    return !!this.map
  }

  constructor( private directiosApiClient: DirectionsApiClient){}
  setMap( map: Map) {
    this.map = map
  }

  flyTo(coords: LngLatLike){
    if(!this.isMapReady) throw Error('El mapa no esta inicializado')

    this.map?.flyTo({
      zoom:17,
      center: coords
    })
  }

  changeLayerMap(){
    if (this.styleMap === 'mapbox://styles/mapbox/streets-v12'){
      this.styleMap = 'mapbox://styles/mapbox/satellite-streets-v12'
    }else{
      this.styleMap = 'mapbox://styles/mapbox/streets-v12'
    }

    this.map?.setStyle(this.styleMap)
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {

    if(!this.map) throw Error('Mapa no inicializado')
    this.markers.forEach( marker => marker.remove())

    const newMarkers=[]

    for (const place of places) {
      const[lng, lat] = place.center
      const popup = new Popup()
        .setHTML(`
           <h6>${place.text}</h6>
           <span>${place.place_name}}</span>
        `)
      const newMarker = new Marker()
      .setLngLat({lng, lat})
      .setPopup( popup )
      .addTo(this.map);

      newMarkers.push( newMarker )
    }
   this.markers = newMarkers;
  if (places.length === 0) return

  //limites del mapa
  const bounds = new LngLatBounds()
  newMarkers.forEach(marker => {
    bounds.extend( marker.getLngLat())

  })
  bounds.extend( userLocation )
  this.map.fitBounds( bounds,{
    padding: 200
  } )
 }

 getRouteBetweenPoints( start: [number, number], end: [number, number] ){
  this.directiosApiClient.get<Directions>(`/${start[0]},${start[1]};${end[0]},${end[1]}`)
  .subscribe(res => this.drawPolyline(res.routes[0])
  )
 }





private drawPolyline( route: Route) {
   console.log({kms: route.distance / 1000, duración: route.duration/60 });
  if(!this.map) throw new Error('Mapa no inicializado')

  const coords = route.geometry.coordinates
  const bounds = new LngLatBounds()

  coords.forEach( ([lng, lat]) => bounds.extend(([lng, lat]) ))

   this.map!.fitBounds(bounds ,{
    padding: 200
   })

// polyline

 const sourceData: AnySourceData = {
  type: 'geojson',
  data:{
    type: 'FeatureCollection',
    features:[
      {
        type:'Feature',
        properties:{},
        geometry:{
          type:'LineString',
          coordinates:coords
        }
      }
    ]
  }
 }

 if(this.map.getLayer('RouteString')){
   this.map.removeLayer('RouteString')
   this.map.removeSource('RouteString')
 }

 this.map.addSource('RouteString', sourceData)

 this.map.addLayer({
     id:'RouteString',
     type:'line',
     source:'RouteString',
     layout: {
      'line-cap' : 'round',
      'line-join' : 'round'
     },
     paint: {
       'line-color' : 'blue',
       'line-width' : 8
     }
 })
 }
}

