export interface Sigungu {
  id: number;
  name: string;
  full_name: string;
}

export interface Sido {
  id: number;
  name: string;
  location_second_parts: Sigungu[];
}
