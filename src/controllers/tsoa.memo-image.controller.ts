import {Request as ExpressRequest, Express} from 'express';
import {
  memoFolderDelete,
  memoImageAdd,
  memoImagesMove,
} from '../services/memo-image.service.tsoa.js';
import {bodyToMemoImagesToMove} from '../dtos/memo-image.dto.tsoa.js';
import {
  Body,
  Controller,
  Delete,
  Patch,
  Path,
  Request,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Example,
  Post,
  UploadedFile,
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {
  MemoFolderImageResponseDto,
  MemoTextImageListResponseDto,
  ResponseMessage,
} from '../models/memo-folder.model.tsoa.js';
import {StatusCodes} from 'http-status-codes';
import {BodyToMemoImagesToMove} from '../models/memo-image.model.tsoa.js';
import {PhotoDataNotFoundError} from '../errors.js';

@Route('memo')
export class MemoImageController extends Controller {
  /**
   * 특정 폴더에 사진을 저장하는 API입니다.
   *
   * @summary 사진 저장 API
   * @param req
   * @param targetFolderId 폴더 ID
   * @returns 성공 시 사진 저장 결과를 반환합니다.
   */
  @Post('/image-format/folders/:folderId')
  @Tags('memo-image-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'MEM-400',
        reason: '메모 사진 추가 중 오류가 발생했습니다.',
        data: {
          folderId: '1',
          imageUrl: 'string',
        },
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 확장자 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'PHO-400',
        reason: '사진 데이터가 유효하지 않습니다.',
        data: {
          extension: 'string',
        },
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'FOL-404',
        reason: '해당 폴더를 찾을 수 없습니다.',
        data: {
          folderId: '1',
        },
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'PHO-404',
        reason: '해당 사진 데이터가 없습니다.',
        data: {
          imageId: '1',
        },
      },
      success: null,
    },
  )
  @SuccessResponse(StatusCodes.OK, '사진 저장 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      folderId: '1',
      folderName: 'string',
      imageId: '1',
      imageUrl: 'string',
    },
  })
  public async handlerMemoImageAdd(
    @Request() req: ExpressRequest,
    @Path('folderId') targetFolderId: string,
    @UploadedFile() image: Express.MulterS3File,
  ): Promise<ITsoaSuccessResponse<MemoFolderImageResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(targetFolderId);
      if (!image) {
        throw new PhotoDataNotFoundError({reason: '저장할 사진이 없습니다.'});
      }
      const imageUrl = image.key;
      const memoImage = await memoImageAdd(folderId, imageUrl, userId);
      return new TsoaSuccessResponse(memoImage);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 사진을 이동하는 API입니다.
   *
   * @summary 사진 이동 API
   * @param req
   * @param currentFolderId 현재 폴더 ID
   * @param body 이동할 폴더 ID, 이동할 사진 배열
   * @returns 성공 시 사진 이동 결과를 반환합니다.
   */
  @Patch('/folders/:folderId/images')
  @Tags('memo-image-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'MEM-400',
        reason: '메모 사진 이동 중 오류가 발생했습니다.',
        data: {
          folderId: '1',
          imageId: ['1'],
        },
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'FOL-404',
        reason: '해당 폴더를 찾을 수 없습니다.',
        data: {
          folderId: '1',
        },
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'PHO-404',
        reason: '해당 사진 데이터가 없습니다.',
        data: {
          imageId: '1',
        },
      },
      success: null,
    },
  )
  @SuccessResponse(StatusCodes.OK, '사진 이동 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      folderId: '1',
      folderName: 'string',
      imageText: 'string',
      images: [
        {
          imageId: '1',
          imageUrl: 'string',
        },
      ],
    },
  })
  public async handlerMemoImageMove(
    @Request() req: ExpressRequest,
    @Path('folderId') currentFolderId: string,
    @Body() body: BodyToMemoImagesToMove,
  ): Promise<ITsoaSuccessResponse<MemoTextImageListResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(currentFolderId);
      const memoImagesToMove = await memoImagesMove(
        userId,
        folderId,
        bodyToMemoImagesToMove(body),
      );
      return new TsoaSuccessResponse(memoImagesToMove);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 사진을 삭제하는 API입니다.
   *
   * @summary 폴더 삭제 API
   * @param req
   * @param targetFolderId 폴더 ID
   * @returns 성공 시 폴더 삭제 결과를 반환합니다.
   */
  @Delete('/folders/:folderId')
  @Tags('memo-folder-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'FOL-404',
        reason: '해당 폴더를 찾을 수 없습니다.',
        data: {
          folderId: '1',
        },
      },
      success: null,
    },
  )
  @SuccessResponse(StatusCodes.OK, '폴더 삭제 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      message: 'string',
    },
  })
  public async handlerMemoFolderDelete(
    @Request() req: ExpressRequest,
    @Path('folderId') targetFolderId: string,
  ): Promise<ITsoaSuccessResponse<ResponseMessage>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(targetFolderId);
      const memoImagesToDelete = await memoFolderDelete(userId, folderId);
      return new TsoaSuccessResponse(memoImagesToDelete);
    } catch (error) {
      throw error;
    }
  }
}
