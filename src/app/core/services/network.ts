import { Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
 
  private isOnline = signal(true);
  readonly online = this.isOnline.asReadonly();

  async initialize(): Promise<void> {
    const status = await Network.getStatus();
    this.isOnline.set(status.connected);
    Network.addListener('networkStatusChange', (status) => {
      this.isOnline.set(status.connected);
    });
  }
  
}
