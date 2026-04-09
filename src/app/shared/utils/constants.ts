export interface Suggestion {
  type: string;
  placeAddress: string;
  eLoc: string;
  placeName: string;
  alternateName: string;
  keywords: string[];
  orderIndex: number;
  suggester: 'placeName' | 'alternateName' | 'toponym' | 'locality';
  distance: number;
  latitude?: number;
  longitude?: number;
}
