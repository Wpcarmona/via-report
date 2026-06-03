import { Component, computed, input } from '@angular/core';
import { IonSkeletonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  standalone: true,
  imports: [IonSkeletonText],
})
export class SkeletonLoaderComponent {

  lines = input<number>(3);

  skeletonLines = computed(() => Array(this.lines()).fill(0));

}
