import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  private http = inject(HttpClient);
  
  async getWeather(latitude: number, longitude: number): Promise<string> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response: any = await firstValueFrom(this.http.get(url))
    return `Temperatua: ${response.current_weather.temperature} °C, Viento: ${response.current_weather.windspeed} km/h`;
  }
}
