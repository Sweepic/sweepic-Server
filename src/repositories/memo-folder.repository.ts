import { prisma } from '../db.config.js';
import { BodyToMemoFolder } from '../models/memo-folder.model.js';

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
