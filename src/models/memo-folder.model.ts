import { UserModel } from './user.model.js';

export interface BodyToMemoFolder {
    folderName: string;
}

export interface ResponseFromMemoFolder {
    id: string;
    userId: bigint;
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
}

export interface ResponseFromMemoFolderImage {
    id: string;
    userId: bigint;
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
}

export interface ResponseFromMemo {
    id: string;
    userId: bigint;
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    memoImages: {
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        status: number;
        folderId: string;
        url: string;
    }[];
}