

export interface ReportFirestoreModel {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    photoUrl: string | null;
    latitude: number;
    longitude: number;
    weatherInfo: string | null;
    syncStatus: string;
    createdAt: number;
    updatedAt: number;
}