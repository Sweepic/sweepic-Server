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

export interface MemoFolderResponseDto {
    id: string;
    folderName: string;
}

export interface MemoFolderImageResponseDto {
    folderId: string;
    folderName: string;
    imageId: string;
    imageUrl: string;
}

export interface MemoFolderRequestDto {
    folderName: string;
}

export interface MemoFolderListResponseDto {
    folderId: string ;
    folderName: string;
    imageText: string;
    imageCount: number;
    firstImageId: string | null;
    firstImageUrl: string | null;
}

export interface MemoTextImageListResponseDto {
    folderId: string;
    folderName: string;
    imageText: string;
    images: {
        imageId: string;
        imageUrl: string;
    }[] | null;
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

export interface ResponseFromMemoList {
    id: string;
    userId: bigint;
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    imageCount: number;
    memoImages: {
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        status: number;
        folderId: string;
        url: string;
    }[];
};

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

export interface createdMemoFolderId {
    id: bigint;
}

export interface MemoFoler {
    id: string;
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    userId: bigint;
}

export interface MemoFolderList {
    id: string;
    imageCount: number;
    memoImages: {
        id: string;
        folderId: string;
        url: string;
        createdAt: Date;
        updatedAt: Date | null;
        status: number;
    }[];
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    userId: bigint;
    _count: {
        memoImages: number;
    };
}

export interface MemoTextImageList {
    id: string;
    memoImages: {
        id: string;
        folderId: string;
        url: string;
        createdAt: Date;
        updatedAt: Date | null;
        status: number;
    }[];
    name: string;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    userId: bigint;
};

// 추가
export interface MemoFolderType {
    name: string;
    id: bigint;
    imageText: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    userId: bigint;
}

export interface ResponseMessage {
    message: string;
}

export interface BodyToMemoTextToUpdate {
    memoText: string;
}