import { prisma } from '../db.config.js';
import { BodyToMemoFolder } from '../models/memo-folder.model.js';
import { getPresignedUrl } from '../s3/get-presigned-url.js';

export const createMemoFolder = async (data: BodyToMemoFolder, userId: bigint) => {
    try {
        const createdMemoFolder = await prisma.memoFolder.create({
            data: {
                name: data.folderName,
                userId: userId,
                imageText: '',
            }
        });
        
        return createdMemoFolder.id;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const getMemoFolder = async (memoFolderId: bigint) => {
    try {
        const memoFolder = await prisma.memoFolder.findFirst({
            where: {
                id: memoFolderId
            },
            select: {
                id: true,
                name: true,
                imageText: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                userId: true,
            }
        });

        if (memoFolder == null) {
            return null;
        }

        const formattedMemoFolder = {
            ...memoFolder,
            id: memoFolder.id.toString()
        };

        return formattedMemoFolder;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const getMemoFolderList = async (userId: bigint) => {
    try {
        const memoFolderList = await prisma.memoFolder.findMany({
            select: {
                id: true,
                userId: true,
                name: true,
                imageText: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                _count: { // 이미지 개수를 세는 필드 추가
                    select: {
                        memoImages: true, // memoImages의 개수를 가져온다.
                    },
                },
                memoImages: {
                    take: 1, // 각 폴더에서 첫 번째 사진만 가져오기
                    orderBy: {
                        createdAt: 'asc', // 업로드된 시간순으로 정렬
                    },
                },
            },
            where: {
                userId: userId
            }
        });

        const formattedMemoFolderList = await Promise.all( // 비동기 작업이 완료될 때까지 기다린 후 처리된 결과를 배열로 반환
            memoFolderList.map(async (memoFolder) => ({
                ...memoFolder,
                id: memoFolder.id.toString(),
                imageCount: memoFolder._count?.memoImages || 0, // 이미지 개수 추가
                memoImages: await Promise.all(
                    memoFolder.memoImages.map(async (memoImage) => {
                        const presignedUrl = await getPresignedUrl(memoImage.url);
                        return {
                            ...memoImage,
                            id: memoImage.id.toString(),
                            folderId: memoImage.folderId.toString(),
                            url: presignedUrl // Pre-signed URL로 변환
                        };
                    })
                ),
            }))
        );

        return formattedMemoFolderList;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const getSearchMemoList = async (userId: bigint, searchKeyword: string) => {
    try {
        const memoSearchList = await prisma.memoFolder.findMany({
            select: {
                id: true,
                name: true,
                imageText: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                userId: true,
                _count: { // 이미지 개수를 세는 필드 추가
                    select: {
                        memoImages: true, // memoImages의 개수를 가져온다.
                    },
                },
                memoImages: {
                    take: 1, 
                    orderBy: {
                        createdAt: 'asc', 
                    },
                },
            },
            where: { // 폴더 이름이나 메모 텍스트에 검색어가 포함된 데이터 필터링
                AND: [
                    {
                        userId: userId
                    },
                    {
                        OR: [
                            {
                                name: { // name 필드에 searchKeyword가 포함된 데이터를 찾는다.
                                    contains: searchKeyword,
                                }
                            },
                            {
                                imageText: { // imageText 필드에 searchKeyword가 포함된 데이터를 찾는다.
                                    contains: searchKeyword,
                                }
                            }
                        ]
                    }
                ]
            }
        });


        const formattedMemoSearchList = await Promise.all(
            memoSearchList.map(async (memoSearch) => ({
                ...memoSearch,
                id: memoSearch.id.toString(),
                imageCount: memoSearch._count?.memoImages || 0, // 이미지 개수 추가
                memoImages: await Promise.all(
                    memoSearch.memoImages.map(async (memoImage) => {
                        const presignedUrl = await getPresignedUrl(memoImage.url);
                        return {
                            ...memoImage,
                            id: memoImage.id.toString(),
                            folderId: memoImage.folderId.toString(),
                            url: presignedUrl // Pre-signed URL로 변환
                        };
                    })
                ),
            }))
        );

        return formattedMemoSearchList;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const getMemoTextImageList = async (userId: bigint, folderId: bigint) => {
    try {
        const memoTextImageList = await prisma.memoFolder.findFirst({
            select: {
                id: true,
                userId: true,
                name: true,
                imageText: true,
                createdAt: true,
                updatedAt: true,
                status: true,
                memoImages: {
                    orderBy: {
                        createdAt: 'asc', // 업로드된 시간순으로 정렬
                    },
                },
            },
            where: {
                userId: userId,
                id: folderId
            }
        });

        if (memoTextImageList == null) {
            return null;
        }

        const formattedMemoTextImageList = {
            ...memoTextImageList,
            id: memoTextImageList.id.toString(),
            memoImages: await Promise.all(memoTextImageList.memoImages.map(async(memoImage) => {
                const presignedUrl = await getPresignedUrl(memoImage.url);
                return {
                    ...memoImage,
                    id: memoImage.id.toString(),
                    folderId: memoImage.folderId.toString(),
                    url: presignedUrl,
                };
            }))
        };

        return formattedMemoTextImageList;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};