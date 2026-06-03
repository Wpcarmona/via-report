import { Component, effect, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteDatasource } from './infrastructure/datasources/local/sqlite.datasource';
import { NetworkService } from './core/services/network';
import { SyncService } from './core/services/sync';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  private sqliteDatasource = inject(SqliteDatasource);
  private networkService = inject(NetworkService);
  private syncService = inject(SyncService);

  constructor() {
    effect(() => {
      if (this.networkService.online()) {
        this.syncService.syncPendingReports();
      }
    })
  }

  ngOnInit(): void {
    this.sqliteDatasource.initDB().catch(err => console.log('Error initializing database', err));
    this.networkService.initialize().catch(err => console.error('Error inicializando red', err));
  }


}
