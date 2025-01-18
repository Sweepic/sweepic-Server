import { prisma } from '../db.config.js';
import { getPresignedUrl } from '../s3/get-presigned-url.js';

export const addMemoImage = async (memoFolderId: bigint, imageUrl: string) => {
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

export const getMemoImage = async (memoImageId: bigint) => {
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
