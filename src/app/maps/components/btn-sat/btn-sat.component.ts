import { Component } from '@angular/core';
import { MapService } from '../../services';

@Component({
  selector: 'app-btn-sat',
  templateUrl: './btn-sat.component.html',
  styleUrls: ['./btn-sat.component.css']
})
export class BtnSatComponent {
      constructor(private mapService: MapService){}

get mapStyle():boolean{
  return this.mapService.styleMap.includes('satellite')
}

changeLayer(){
   this.mapService.changeLayerMap()
      }
}
