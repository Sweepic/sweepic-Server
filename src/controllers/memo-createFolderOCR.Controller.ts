import {Request as ExpressRequest} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';
import {StatusCodes} from 'http-status-codes';
import {
  DataValidationError,
  PhotoDataNotFoundError,
  PhotoValidationError,
} from '../errors.js';
import {
  Controller,
  Example,
  FormField,
  Request,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Post,
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';

@Route('memo')
export class MemoCreateUpdateOCRController extends Controller {
  /**
   * 새로운 폴더를 생성하고, 이미지에서 OCR 텍스트를 추출하여 이미지와 텍스트를 저장하는 API입니다.
   *
   * @summary 폴더 생성 및 OCR 수행
   * @param req
   * @param folderName 생성할 폴더의 이름
   * @returns 성공 시 폴더를 생성하고 텍스트를 저장한 결과를 반환합니다.
   */
  @Post('/text-format/folders')
  @Tags('memo-ai')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, '잘못된 요청 데이터', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: {reason: 'base64_image, user_id, folder_name이 필요합니다.'},
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
  @Response<ITsoaErrorResponse>(StatusCodes.CONFLICT, '중복 데이터 에러', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'FOL-409',
      reason: '이미 존재하는 폴더 이름입니다.',
      data: {folderName: 'string'},
    },
  })
  @SuccessResponse(StatusCodes.OK, '폴더 생성 및 텍스트 변환')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      folder_id: '1',
      image_text: '이번 수업 시간은 사회 과학 시간이다.',
    },
  })
  public async createFolderOCR(
    @Request() req: ExpressRequest,
    @FormField('folder_name') folderName: string,
  ): Promise<ITsoaSuccessResponse<{folder_id: string; image_text: string}>> {
    try {
      if (!req.file) {
        throw new PhotoDataNotFoundError({
          reason: '텍스트를 추출할 사진이 없습니다.',
        });
      }

      //파일 업로드가 있는 경우 base64 변환
      const base64_image = `data:image/png;base64,${req.file.buffer.toString('base64')}`;

      const user_id = BigInt(req.user!.id);
      const folder_name = folderName;

      // 유효성 검사-데이터가 하나라도 빠지지 않도록
      // 유효성 검사
      if (!base64_image || !user_id || !folder_name) {
        throw new DataValidationError({
          reason: 'base64_image, user_id, folder_name이 필요합니다.',
        });
      }
      //base64 이미지 검증 - 올바른 형태인지
      if (!isValidBase64(base64_image)) {
        throw new PhotoValidationError({
          reason: '올바른 Base64 이미지 형식이 아닙니다.',
        });
      }

      // 서비스 호출
      const result = await processOCRAndSave({
        base64_image,
        user_id,
        folder_name,
      });

      // 성공 응답
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
  // base64 문자열 검증 함수
  const base64Regex = /^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(base64String);
};
