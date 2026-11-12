export interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  copyright: string;
  isFallback: boolean;
}

export interface DonkiFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  classType: string;
  sourceLocation: string;
  note: string;
  isFallback: boolean;
}

export interface MarsWeatherData {
  sol: string;
  terrestrial_date: string;
  min_temp_c: number;
  max_temp_c: number;
  pressure_pa: number;
  atmo_opacity: string;
  source: string;
  isFallback: boolean;
}
