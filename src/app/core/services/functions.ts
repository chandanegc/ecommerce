import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface AddressDetails {
  fullAddress: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  district?: string;
  locality?: string;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: any;
}

export interface MarkerInput {
  lat?: number;
  lng?: number;
  eLoc?: string;   // Mappls pin
  placeName?: string;
}

@Injectable({
  providedIn: 'root',
})


export class Functions {

  private API_KEY = environment.MAPPLS_TOKEN;
  private http: HttpClient = inject(HttpClient);
  private markers: any[] = [];

  //Get Current Location------------------------
  public getCurrentLocation(): Observable<UserLocation> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => observer.error(error.message),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });
  }

  // Watch location changes------------------------
  private watchId: number | null = null;
  public watchLocation(options?: PositionOptions): Observable<UserLocation> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation not supported');
        return;
      }

      const geoOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => observer.error(error.message),
        geoOptions,
      );

      return () => this.stopWatching();
    });
  }
  public stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two locations using Haversine formula-------------------------
  public calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    unit: 'km' | 'm' = 'km',
  ): number {
    const R: number = 6371;

    const toRad: (value: number) => number = (value: number) => (value * Math.PI) / 180;

    const dLat: number = toRad(lat2 - lat1);
    const dLng: number = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c;

    // convert to meters if needed
    if (unit === 'm') {
      distance = distance * 1000;
    }

    return Number(distance.toFixed(2));
  }

  // Get address from coordinates using reverse geocoding-------------------------
  public getAddressFromCoords(lat: number, lng: number): Observable<AddressDetails> {
    const url = `https://apis.mappls.com/advancedmaps/v1/${this.API_KEY}/rev_geocode?lat=${lat}&lng=${lng}`;

    return this.http.get<any>(url).pipe(
      map((res) => ({
        fullAddress: res?.formatted_address,
        city: res?.city || res?.town || res?.village,
        state: res?.state,
        country: res?.country,
        pincode: res?.pincode,
        district: res?.district,
        locality: res?.locality || res?.subLocality,
      })),
    );
  }

  // Get directions between two points-------------------------
  public getDirections(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Observable<RouteInfo> {
    const url = `https://apis.mappls.com/advancedmaps/v1/${this.API_KEY}/route_adv/driving/${startLat},${startLng};${endLat},${endLng}`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const route = res.routes?.[0];

        return {
          distance: route?.distance, // meters
          duration: route?.duration, // seconds
          geometry: route?.geometry, // polyline data
        };
      }),
    );
  }

  //Add markers to map-------------------------
  public addMarkers(
    map: any,
    plugin: any,
    data:any,
    popupHtml: string = '',
    zoom: number = 10,
    // onClick?: (item: MarkerInput) => void
  ) {
    console.log('Adding markers with data:', data);
    if (!map || !plugin) {
      console.error('Map or plugin not initialized');
      return;
    }

    if (!data || data.length === 0) {
      console.warn('No markers to display');
      return;
    }

    this.clearMarkers();

    const validMarkers = data.filter((item: any) => item.eLoc);

    if (validMarkers.length === 0) {
      console.warn('No valid markers with eLoc found in suggestion list');
      return;
    }

    validMarkers.forEach((item: any) => {
      try {
        // Map latitude/longitude to lat/lng for consistency
        const lat = item.lat || item.latitude;
        const lng = item.lng || item.longitude;

        const html = popupHtml || `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <strong style="font-size: 14px; color: #333;">${item.placeName || 'Unknown Place'}</strong>
            <p 
              style="color: #0066cc; cursor: pointer; margin: 8px 0 0 0; padding: 4px 0; font-size: 12px; text-decoration: underline;"
              onclick="getDirection('${lat || ''}', '${lng || ''}', '${(item.placeName || '').replace(/'/g, "\\'")}', '${item.eLoc || ''}')"
            >
              Get Direction
            </p>
          </div>
        `;

        const marker = plugin.pinMarker({
          map,
          pin: item.eLoc,
          popupHtml: html,
          zoom,
        });

        if (marker) {
          this.markers.push(marker);
          console.log(`Marker added for: ${item.placeName} (${item.eLoc})`);
        }

      } catch (error) {
        console.error(`Failed to add marker for ${item.placeName}:`, error);
      }
    });

    console.log(`Total markers displayed: ${this.markers.length} out of ${data.length}`);
  }
  public addOneMarker(
    map: any,
    plugin: any,
    item: MarkerInput,
    onClick?: (item: MarkerInput) => void
  ) {
    const marker = plugin.pinMarker({
      map,
      pin: item.eLoc,
      popupHtml: `<h1>${item.placeName || 'Unknown Place'}</h1>`,
    });

    marker.on('click', () => {
      onClick?.(item);
    });

    this.markers.push(marker);
    return marker;
  }
  public clearMarkers() {
    this.markers.forEach((m) => {
      if (m && typeof m.remove === 'function') {
        m.remove();
      }
    });
    this.markers = [];
  }
  public focus(map: any, item: { lat?: number; lng?: number; eLoc?: string }, zoom = 16) {

  if (item.eLoc) {
    map.flyTo({
      center: item.eLoc,
      zoom
    });
    return;
  }

  if (item.lat && item.lng) {
    map.flyTo({
      center: [item.lat, item.lng],
      zoom
    });
  }
}
}
