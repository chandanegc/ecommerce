import { Component, signal } from '@angular/core';
import { mappls, mappls_plugin } from 'mappls-web-maps';
import { CommonModule } from '@angular/common';
import { MAPPLS_TOKEN } from '../../shared/utils/constants';
import { SuggetionBox } from '../../shared/components/suggetion-box/suggetion-box';
import { InputBox } from '../../shared/components/input-box/input-box';
import { Button } from '../../shared/components/button/button';
import { SUGGETION } from '../../shared/utils/constants';

@Component({
  selector: 'app-map',
  imports: [CommonModule, SuggetionBox, InputBox, Button],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  mapobject: any
  marker: any
  mapplsClassObject: any = new mappls()
  mapplsPluginObject: any = new mappls_plugin()
  title = 'Map_angular';
  suggestion = signal<any[]>(SUGGETION);
  location = signal<string>('')
  markers: any[] = [];

  onLocationChange(event: any) {
    this.location.set(event);
    this.suggestion.set(SUGGETION.filter((item) => item.placeName.toLowerCase().includes(event.toLowerCase())))
    this.showMarker(this.suggestion().map((item: any) => ({ lat: item.latitude, lng: item.longitude, placeName: item.placeName })));
  }

  onSuggestionClick(item: any) {
    console.log(item)
    this.mapobject.setCenter([item.longitude, item.latitude]);
    this.mapobject.setZoom(12);
  }

  showMarker(arr: any[]) {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    arr.forEach((item) => {
      const marker = this.mapplsClassObject.Marker({
        map: this.mapobject,
        position: { lat: item.lat, lng: item.lng },
        popupHtml: `<div>${item.placeName}</div>`
      });

      marker.on('click', () => {
        this.mapobject.setCenter([item.lat, item.lng]);
        this.mapobject.setZoom(14);
      });

      this.markers.push(marker);
    });
  }

  ngOnInit() {
    const loadObject = {
      map: true,
      layer: 'raster',
      version: '3.0',
      libraries: ['airspacelayers'],
      plugins: ['direction'],
      auth: 'legacy'
    };

    this.mapplsClassObject.initialize(
      MAPPLS_TOKEN,
      loadObject,
      () => {
        this.mapobject = this.mapplsClassObject.Map({
          id: 'map',
          properties: {
            center: [28.61, 77.23],
            zoomControl: true,
            location: true,
          },
        });

        this.mapobject.on('load', () => {
          this.showMarker(SUGGETION.map((item: any) => ({ lat: item.latitude, lng: item.longitude, placeName: item.placeName })));
        });
      }
    );
  }
}