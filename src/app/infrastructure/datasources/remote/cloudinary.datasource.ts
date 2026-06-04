import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Filesystem } from '@capacitor/filesystem';
import { CLOUDINARY_CONFIG } from 'src/app/shared/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryDatasource {
  private http = inject(HttpClient);

  async uploadPhoto(nativeUri: string): Promise<string> {
    const file = await Filesystem.readFile({ path: nativeUri });
    const base64 = typeof file.data === 'string' ? file.data : '';

    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64}`);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const response = await firstValueFrom(
      this.http.post<any>(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        formData
      )
    );

    return response.secure_url;
  }

  isLocalPath(path: string): boolean {
    return !path.startsWith('http://') && !path.startsWith('https://');
  }
}
