import {ValidateError} from 'tsoa';

export class RestoreImagesDTO {
  mediaIdList: bigint[];
  userId: bigint;

  constructor(mediaIdList: string[], userId: bigint) {
    this.userId = userId;
    if (mediaIdList.length === 0) {
      throw new ValidateError(
        {
          mediaIdList: {
            value: mediaIdList,
            message: '하나이상의 복구할 사진을 선택해주세요',
          },
        },
        '잘못된 요청입니다.',
      );
    }
    this.mediaIdList = mediaIdList.map(mediaId => BigInt(mediaId));
  }
}

export class DeleteImagesDTO {
  mediaIdList: bigint[];
  userId: bigint;

  constructor(mediaIdList: string[], userId: bigint) {
    this.userId = userId;
    if (mediaIdList.length === 0) {
      throw new ValidateError(
        {
          mediaIdList: {
            value: mediaIdList,
            message: '하나이상의 삭제할 사진을 선택해주세요',
          },
        },
        '잘못된 요청입니다.',
      );
    }
    this.mediaIdList = mediaIdList.map(mediaId => BigInt(mediaId));
  }
}
