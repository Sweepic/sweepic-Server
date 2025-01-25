import { prisma } from '../db.config.js';
import { ResponseMessage } from '../models/memo-folder.model.js';
import { BodyToMemoImagesToDelete, BodyToMemoImagesToMove, MemoImage } from '../models/memo-image.model.js';
import { getPresignedUrl } from '../s3/get-presigned-url.js';
import { imageDeleter } from '../s3/image.deleter.js';
import { imageMover } from '../s3/image.mover.js';

export const addMemoImage = async (memoFolderId: bigint, imageUrl: string): Promise<bigint> => {
    try {
        const addedMemoImageId = await prisma.memoImage.create({
            data: {
                folderId: memoFolderId,
                url: imageUrl
            }
        });

        return addedMemoImageId.id;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const getMemoImage = async (memoImageId: bigint): Promise<MemoImage | null> => {
    try {
        const memoImage = await prisma.memoImage.findFirst({
            where: {
                id: memoImageId
            }
        });

        if (memoImage == null) {
            return null;
        }

        const presignedUrl = await getPresignedUrl(memoImage.url); // pre-signed URL 생성

        const formattedMemoImage = {
            ...memoImage,
            id: memoImage.id.toString(),
            folderId: memoImage.folderId.toString(),
            url: presignedUrl, // pre-signed URL로 변환
        };

        return formattedMemoImage;
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const moveMemoImages = async (userId: bigint, folderId:bigint, body: BodyToMemoImagesToMove) :Promise<ResponseMessage | null>=> {
    try {
        for (const imgId of body.imageId) {
            const image = await prisma.memoImage.update({
                where: {
                    id: imgId,
                    folderId
                },
                data: {
                    folderId: body.targetFolderId,
                    updatedAt: new Date()
                }
            });

            if (image == null) {
                return null;
            }

            imageMover(userId, image.url, body.targetFolderId);
        }
        return { message: '성곡적으로 이동하였습니다'};
    }
    catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const deleteMemoImages = async (userId: bigint, folderId: bigint, data: BodyToMemoImagesToDelete) :Promise<void|null>=> {
    try {
        for (const imgId of data.imageId) {
            const image = await prisma.memoImage.findFirst({
                where: {
                    id: imgId,
                    folderId,
                    memoFolder: {
                        userId
                    }
                }
            });

            if (image == null) { return null; }

            imageDeleter(image.url);

            await prisma.memoImage.delete({
                where: {
                    id: imgId
                }
            });
        }
    } catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};

export const updateMemoImageUrl = async(key: string, targetKey:string) :Promise<void>=> {
    try {
        const image = await prisma.memoImage.findFirst({where: {url: key}});
        await prisma.memoImage.update({
            where: {
                id: image!.id
            },
            data: {
                url: targetKey,
                updatedAt: new Date()
            }
        });
    } catch (err) {
        throw new Error('서버 내부 오류 또는 존재하지 않는 데이터');
    }
};