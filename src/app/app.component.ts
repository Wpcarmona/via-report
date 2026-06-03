import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteDatasource } from './infrastructure/datasources/local/sqlite.datasource';
import { NetworkService } from './core/services/network';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  private sqliteDatasource = inject(SqliteDatasource);
  private networkService = inject(NetworkService);
  
  ngOnInit(): void {
    this.sqliteDatasource.initDB().catch(err => console.log('Error initializing database', err));
    this.networkService.initialize().catch(err => console.error('Error inicializando red', err));
  }
}
