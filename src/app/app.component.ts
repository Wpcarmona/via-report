import { Component, effect, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteDatasource } from './infrastructure/datasources/local/sqlite.datasource';
import { NetworkService } from './core/services/network';
import { SyncService } from './core/services/sync';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  private sqliteDatasource = inject(SqliteDatasource);
  private toastController = inject(ToastController);
  private networkService = inject(NetworkService);
  private syncService = inject(SyncService);

  private previousOnlineState: boolean | null = null;

   constructor() {
    effect(() => {
      const isOnline = this.networkService.online();
      
      if (this.previousOnlineState === null) {
        this.previousOnlineState = isOnline; 
        return;
      } 
      
      if (isOnline !== this.previousOnlineState) {
        this.previousOnlineState = isOnline;
        if (isOnline) {
          this.showToast('Conexión restaurada', 'success');
          this.syncService.syncPendingReports();
        } else {
          this.showToast('Sin conexión a internet', 'danger');
        } 
      } 
    });
  }

   async ngOnInit(): Promise<void> {
    try {
      await this.sqliteDatasource.initDB();
      await this.networkService.initialize();
      if (this.networkService.online()) {
        this.syncService.syncPendingReports();
      }
    } catch (err) {
      console.error('Error inicializando app', err);
    }
  }



  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }


}
