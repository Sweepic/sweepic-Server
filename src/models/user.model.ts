export interface UserModel {
    id: bigint;
    email: string;
    name: string;
    imageMax: number;
    isLocalGalleryAccesible: boolean;
    enableNotification: boolean;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
}