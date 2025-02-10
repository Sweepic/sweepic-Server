export interface ResponseFromMostTag{
    _count: {
        _all: number;
    }
    tagCategoryId: bigint;
    content: string;
}

export interface ResponseFromMostTagToClient{
    _count: {
        _all: number;
    }
    tagCategoryId: string;
    content: string;
}

export interface ResponseFromAward{
    id: string,
    awardMonth: Date,
    createdAt: Date,
    updatedAt: Date | null,
    status: number,
    userId: string
}

export interface ResponseFromUpdateAward{
    imageId: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    awardId: string;
}