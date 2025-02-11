import {Request as ExpressRequest} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';
import {
  DataValidationError,
  PhotoDataNotFoundError,
  PhotoValidationError,
} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {
  Controller,
  Route,
  Request,
  Path,
  Tags,
  Response,
  SuccessResponse,
  Example,
  Patch,
  Middlewares,
} from 'tsoa';
import {StatusCodes} from 'http-status-codes';
import {uploadMiddleware} from '../ai/ai-upload.middleware.js';

@Route('memo')
export class MemoCreateFolderOCRController extends Controller {
  /**
   * 기존 폴더에 이미지를 추가하고, OCR 텍스트를 업데이트하는 API입니다.
   *
   * @summary 폴더 업데이트 및 OCR 수행
   * @param req
   * @param base64Image OCR 처리를 위한 이미지 URL
   * @param folderId 업데이트할 폴더의 ID
   * @returns 성공 시 특정 폴더에 텍스트를 저장한 결과를 반환합니다.
   */
  @Patch('/text-format/folders/:folderId')
  @Middlewares(uploadMiddleware)
  @Tags('memo-ai')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: {reason: 'folder_ID가 필요합니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: {reason: 'base64_image가 필요합니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: {reason: 'user_id가 필요합니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
      data: {reason: '올바른 Base64 이미지 형식이 아닙니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
      data: {reason: '텍스트를 추출할 사진이 없습니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
      data: {reason: '이미지에서 텍스트를 찾지 못하였습니다.'},
    },
  })
  @Response<ITsoaErrorResponse>(
    StatusCodes.NOT_FOUND,
    '존재하지 않은 데이터 조회 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-404',
        reason: '해당 폴더를 찾을 수 없습니다.',
        data: {folderId: '1'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '폴더 업데이트 및 텍스트 변환')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      folder_id: '1',
      image_text: '이번 수업 시간은 사회 과학 시간이다.',
    },
  })
  public async updateFolderOCR(
    @Request() req: ExpressRequest,
    @Path('folderId') folderId: number,
  ): Promise<ITsoaSuccessResponse<{folder_id: string; image_text: string}>> {
    try {
      if (!req.file) {
        throw new PhotoDataNotFoundError({
          reason: '텍스트를 추출할 사진이 없습니다.',
        });
      }

      // 파일이 존재하는 경우 base64 변환
      const base64_image = `data:image/png;base64,${req.file.buffer.toString('base64')}`;

      //const {folderId} = req.params; // URL 매개변수에서 folderId 가져오기
      const user_id = BigInt(req.user!.id);

      // 유효성 검사
      if (!folderId) {
        throw new DataValidationError({
          reason: 'folder_ID가 필요합니다.',
        });
      }

      if (!base64_image) {
        throw new DataValidationError({
          reason: 'base64_image가 필요합니다.',
        });
      }

      if (!user_id) {
        throw new DataValidationError({reason: 'user_id가 필요합니다.'});
      }
      //bae64 이미지 형태 검증
      if (!isValidBase64(base64_image)) {
        throw new PhotoValidationError({
          reason: '올바른 Base64 이미지 형식이 아닙니다.',
        });
      }

      const result = await processOCRAndSave({
        folder_id: Number(folderId),
        base64_image,
        user_id,
      });

      return new TsoaSuccessResponse({
        folder_id: result.folder_id,
        image_text: result.image_text,
      });
    } catch (error) {
      throw error;
    }
  }
}

const isValidBase64 = (base64String: string): boolean => {
  // MIME 타입 검증 (jpeg, png, jpg 허용)
  const base64Regex = /^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(base64String);
};
