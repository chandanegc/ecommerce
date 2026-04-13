import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mappls, mappls_plugin } from 'mappls-web-maps';
import { Suggestion } from '../../shared/utils/constants';
import { MapSearchCard } from '../../shared/components/map-search-card/map-search-card';
import { environment } from '../../../environments/environment';
import { Data } from '../../core/services/data';
import { Functions } from '../../core/services/functions';
import { SearchSuggestionService } from '../../core/services/search-suggestion';

interface MarkerPosition {
  lat?: number;
  lng?: number;
  placeName: string;
  eLoc?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapSearchCard],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  private readonly mapplsClient = new mappls();
  readonly mapplsPlugin = new mappls_plugin();

  public mapInstance = signal<any>(null);
  private activeMarkers: any[] = [];
  private isMapLoaded = false;

  public destination = signal<any>({} as any);
  public source = signal<Suggestion>({} as Suggestion);

  data = inject(Data);
  searchService = inject(SearchSuggestionService);
  markerService = inject(Functions);
  ngOnInit(): void {
    const loadConfig = {
      map: true,
      layer: 'raster',
      version: '3.0',
      libraries: ['airspacelayers'],
      plugins: ['marker', 'eloc'],
      auth: 'legacy',
    };

    (window as any).getDirection = (lat: string, lng: string, placeName: string, eLoc?: string) => {
      this.getDirection({ lat, lng, placeName, eLoc });
    };


    this.mapplsClient.initialize('5fde97775d957586e3593c6bbce22970', loadConfig, () => {
      this.mapInstance.set(this.mapplsClient.Map({
        id: 'map',
        properties: {
          center: [28.61, 77.23],
          zoomControl: true,
          location: true,
          zoom: 4,
        },
      }));

      // this.mapInstance()?.on('load', () => {
      //   if (this.isMapLoaded) return;
      //   this.isMapLoaded = true;
      // });
    });
  }

  focusOnMap() {
    this.markerService.focus(this.mapInstance(), { eLoc: 'mmi000' });
  }
  private getDirection(pos: any): void {
    this.destination.set(pos)
  }

  public renderDirection(data: { source: Suggestion, destination: Suggestion }): void {
    if (!data.source?.eLoc || !data.destination?.eLoc) {
      console.warn('Need both source and destination eLoc for directions');
      return;
    }

    try {
      this.mapplsPlugin.direction({
        map: this.mapInstance(),
        start: { label: data.source.placeName, geoposition: data.source.eLoc },
        end: { label: data.destination.placeName, geoposition: data.destination.eLoc },
        Profile: ['driving']
      });
    } catch (err) {
      console.error('Error drawing direction', err);
    }
  }

  public showMarker(positions: MarkerPosition[]): void {

    this.markerService.addMarkers(
      this.mapInstance(),
      this.mapplsPlugin,
      positions
    );


    // this.clearMarkers();

    // positions.forEach((pos) => {
    //   console.log("pos", pos)
    //   const marker = this.mapplsPlugin.pinMarker({
    //     map: this.mapInstance(),
    //     pin: pos.eLoc,
    //     zoom: 16,
    //     popupHtml: `
    //     <div style="padding: 8px;">
    //       <strong>${pos.placeName}</strong>
    //       <p 
    //         style="color: blue; cursor: pointer; margin: 4px 0 0 0;"
    //         onclick="getDirection('${pos.lat || ''}', '${pos.lng || ''}', '${pos.placeName.replace(/'/g, "\\'")}', '${pos.eLoc || ''}')"
    //       >
    //         Get Direction
    //       </p>
    //     </div>
    //   `,
    //   });

    //   marker.on('click', () => {
    //     console.log("marker clicked")
    //   });
    //   this.activeMarkers.push(marker);
    // });
  }

  private clearMarkers(): void {
    this.activeMarkers.forEach((m) => m.remove());
    this.activeMarkers = [];
  }

  ngOnDestroy(): void {
    delete (window as any).getDirection;
    this.clearMarkers();
    this.mapInstance()?.remove?.();
    this.mapInstance.set(null);
  }
}