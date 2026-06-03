import { SyncStatus } from './sync-status.enum';

export class Report {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    photoUrl: string | null;
    latitude: number;
    longitude: number;
    weatherInfo: string | null;
    syncStatus: SyncStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        userId: string,
        title: string,
        description: string | null,
        photoUrl: string | null,
        latitude: number,
        longitude: number,
        weatherInfo: string | null,
        syncStatus: SyncStatus,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.photoUrl = photoUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.weatherInfo = weatherInfo;
        this.syncStatus = syncStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}