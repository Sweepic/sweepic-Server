export interface ResponseFromMemoImage {
    id: string;
    folderId: string;
    url: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
}

export interface BodyToMemoImage {
    url: string;
}

export interface MemoImageRequestDto {
    url: string;
}

export interface MemoImage {
    id: string;
    folderId: string;
    url: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
}

export interface BodyToMemoImagesToMove {
    targetFolderId: bigint;
    imageId: bigint[];
}

export interface BodyToMemoImagesToDelete {
    imageId: bigint[];
}