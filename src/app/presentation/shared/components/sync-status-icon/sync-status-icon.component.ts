import { Component, computed, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { SyncStatus } from 'src/app/domain/entities/sync-status.enum';
import { addIcons } from 'ionicons';
import {
  cloudOutline,
  syncOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  helpOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-sync-status-icon',
  templateUrl: './sync-status-icon.component.html',
  styleUrls: ['./sync-status-icon.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class SyncStatusIconComponent {
  status = input<string>('');

  constructor() {
    addIcons({
      cloudOutline,
      syncOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      helpOutline,
    });
  }

  icon = computed(() => {
    switch (this.status()) {
      case SyncStatus.PENDING:
        return 'cloud-outline';
      case SyncStatus.SYNCING:
        return 'sync-outline';
      case SyncStatus.SYNCED:
        return 'checkmark-circle-outline';
      case SyncStatus.ERROR:
        return 'alert-circle-outline';
      default:
        return 'help-outline';
    }
  });
}
