import {StatusCodes} from 'http-status-codes';
import {
  bodyToMemoFolder,
  bodyToMemoTextToUpdate,
} from '../dtos/memo-folder.dto.tsoa.js';
import {
  listMemoFolder,
  listMemoTextImage,
  memoFolderCreate,
  memoFolderUpdate,
  memoSearch,
  memoTextUpdate,
} from '../services/memo-folder.service.tsoa.js';
import {memoImageDelete} from '../services/memo-image.service.tsoa.js';
import {bodyToMemoImagesToDelete} from '../dtos/memo-image.dto.tsoa.js';
import {DataValidationError, FolderValidationError} from '../errors.js';
import {
  Response,
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Request,
  Get,
  Query,
  Path,
  Patch,
  Example,
} from 'tsoa';
import {
  BodyToMemoFolder,
  BodyToMemoTextToUpdate,
  MemoFolderListResponseDto,
  MemoFolderResponseDto,
  MemoTextImageListResponseDto,
} from '../models/memo-folder.model.tsoa.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {BodyToMemoImagesToDelete} from '../models/memo-image.model.tsoa.js';
import {Request as ExpressRequest} from 'express';

@Route('memo')
export class MemoFolderController extends Controller {
  // /**
  //  * 폴더 생성과 동시에 파일을 저장하는 API입니다.
  //  *
  //  * @summary 폴더 생성 및 사진 저장 API
  //  * @param req
  //  * @param folderName 생성할 폴더 이름
  //  * @param image 파일 업로드
  //  * @returns 성공 시 폴더 생성 및 사진 저장 결과를 반환합니다.
  //  *
  //  */
  // @Post('/image-format/folders')
  // @Middlewares(ImageUploadMiddleware)
  // @Tags('memo-folder-controller')
  // @Response<ITsoaErrorResponse>(
  //   StatusCodes.BAD_REQUEST,
  //   '유효하지 않은 데이터 에러',
  //   {
  //     resultType: 'FAIL',
  //     success: null,
  //     error: {
  //       errorCode: 'FOL-400',
  //       reason: '폴더 생성 중 오류가 발생했습니다.',
  //       data: {userId: '1', folderName: 'string'},
  //     },
  //   },
  // )
  // @Response<ITsoaErrorResponse>(
  //   StatusCodes.BAD_REQUEST,
  //   '유효하지 않은 데이터 에러',
  //   {
  //     resultType: 'FAIL',
  //     error: {
  //       errorCode: 'PHO-400',
  //       reason: '사진 데이터가 유효하지 않습니다.',
  //       data: {
  //         reason: '저장할 사진이 없습니다.',
  //       },
  //     },
  //     success: null,
  //   },
  // )
  // @Response<ITsoaErrorResponse>(
  //   StatusCodes.BAD_REQUEST,
  //   '유효하지 않은 데이터 에러',
  //   {
  //     resultType: 'FAIL',
  //     error: {
  //       errorCode: 'MEM-400',
  //       reason: '메모 사진 추가 중 오류가 발생했습니다.',
  //       data: {
  //         folderId: '1',
  //         imageUrl: 'string',
  //       },
  //     },
  //     success: null,
  //   },
  // )
  // @Response<ITsoaErrorResponse>(
  //   StatusCodes.BAD_REQUEST,
  //   '유효하지 않은 데이터 에러',
  //   {
  //     resultType: 'FAIL',
  //     error: {
  //       errorCode: 'PHO-400',
  //       reason: '사진 데이터가 유효하지 않습니다.',
  //       data: {
  //         extension: 'string',
  //       },
  //     },
  //     success: null,
  //   },
  // )
  // @Response<ITsoaErrorResponse>(StatusCodes.CONFLICT, '중복 데이터 에러', {
  //   resultType: 'FAIL',
  //   success: null,
  //   error: {
  //     errorCode: 'FOL-409',
  //     reason: '이미 존재하는 폴더 이름입니다.',
  //     data: {folderName: 'string'},
  //   },
  // })
  // @SuccessResponse(StatusCodes.OK, '폴더 생성 및 사진 저장 성공 응답')
  // @Example({
  //   resultType: 'SUCCESS',
  //   error: null,
  //   success: {
  //     folderId: '1',
  //     folderName: 'string',
  //     imageId: '1',
  //     imageUrl: 'string',
  //   },
  // })
  // public async handlerMemoFolderImageAdd(
  //   @Request() req: ExpressRequest,
  //   @FormField() folderName: string,
  // ): Promise<ITsoaSuccessResponse<MemoFolderImageResponseDto>> {
  //   try {
  //     const userId = BigInt(req.user!.id);

  //     if (!req.file) {
  //       throw new PhotoValidationError({reason: '저장할 사진이 없습니다.'});
  //     }
  //     const imageUrl = (req.file as Express.MulterS3File).key;
  //     const folderId = req.uploadDirectory;
  //     const memoFolderImage = await memoFolderImageCreate(
  //       userId,
  //       folderId,
  //       imageUrl,
  //       folderName,
  //     );
  //     return new TsoaSuccessResponse(memoFolderImage);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  /**
   * 폴더를 생성하는 API입니다.
   *
   * @summary 폴더 생성 API
   * @param req
   * @param body 생성할 폴더 이름
   * @returns 성공 시 폴더 생성 결과를 반환합니다.
   */
  @Post('/folders')
  @Tags('memo-folder-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '폴더 생성 중 오류가 발생했습니다.',
        data: {userId: '1', folderName: 'string'},
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
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '폴더명을 1자 이상 입력해야 합니다.',
        data: {folderName: ''},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '폴더 생성 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      id: '1',
      folderName: 'string',
    },
  })
  public async handlerMemoFolderAdd(
    @Request() req: ExpressRequest,
    @Body() body: BodyToMemoFolder,
  ): Promise<ITsoaSuccessResponse<MemoFolderResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      if (body.folderName === null || body.folderName.trim().length === 0) {
        throw new FolderValidationError({
          folderName: body.folderName,
        });
      }
      const memoFolder = await memoFolderCreate(userId, bodyToMemoFolder(body));
      return new TsoaSuccessResponse(memoFolder);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 모든 메모를 조회하는 API입니다.
   *
   * @summary 모든 메모 조회 API
   * @param req
   * @returns 성공 시 메모 조회 결과를 반환합니다.
   */
  @Get('/list')
  @Tags('memo-folder-controller')
  @SuccessResponse(StatusCodes.OK, '메모 조회 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      data: [
        {
          folderId: '1',
          folderName: 'string',
          imageCount: 0,
          imageText: 'string',
          firstImageId: '1',
          firstImageUrl: 'string',
          createdAt: '2025-01-17T03:50:25.923Z',
        },
      ],
    },
  })
  public async handlerMemoFolderList(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<{data: MemoFolderListResponseDto[]}>> {
    try {
      const userId = BigInt(req.user!.id);
      const memoList = await listMemoFolder(userId);
      return new TsoaSuccessResponse(memoList);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 메모를 검색 및 조회하는 API입니다.
   *
   * @summary 메모 검색 API
   * @param req
   * @param keyword 검색 키워드
   * @returns 성공 시 메모 검색 결과를 반환합니다.
   */
  @Get('/search')
  @Tags('memo-folder-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 검색 키워드 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'SRH-400',
        reason: '입력 데이터가 유효하지 않습니다.',
        data: {reason: '검색어를 1자 이상 입력하세요.'},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '메모 검색 성공 응답')
  @Example({
    resultType: 'SUCCESS',
    error: null,
    success: {
      data: [
        {
          folderId: '1',
          folderName: 'string',
          imageCount: 0,
          imageText: 'string',
          firstImageId: '1',
          firstImageUrl: 'string',
          createdAt: '2025-01-17T03:50:25.923Z',
        },
      ],
    },
  })
  public async handlerMemoSearch(
    @Request() req: ExpressRequest,
    @Query() keyword: string,
  ): Promise<ITsoaSuccessResponse<{data: MemoFolderListResponseDto[]}>> {
    try {
      const userId = BigInt(req.user!.id);
      const searchKeyword = keyword?.toString();
      if (searchKeyword === null || searchKeyword.trim().length === 0) {
        throw new DataValidationError({
          reason: '검색어를 1자 이상 입력하세요.',
        });
      }
      const searchMemoList = await memoSearch(userId, searchKeyword);
      return new TsoaSuccessResponse(searchMemoList);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 사진을 삭제하는 API입니다.
   *
   * @summary 사진 삭제 API
   * @param req
   * @param folderIdParam 폴더 ID
   * @param body 이동할 사진 ID 배열
   * @returns 성공 시 사진 삭제 결과를 반환합니다.
   */
  @Post('/folders/:folderId/images/delete')
  @Tags('memo-image-controller')
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
  @SuccessResponse(StatusCodes.OK, '사진 삭제 성공 응답')
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
  public async handlerMemoImageDelete(
    @Request() req: ExpressRequest,
    @Path('folderId') folderIdParam: string,
    @Body() body: BodyToMemoImagesToDelete,
  ): Promise<ITsoaSuccessResponse<MemoTextImageListResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(folderIdParam);
      const memoImagesToMove = await memoImageDelete(
        userId,
        folderId,
        bodyToMemoImagesToDelete(body),
      );
      return new TsoaSuccessResponse(memoImagesToMove);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 모든 메모(텍스트 및 사진)을 조회하는 API입니다.
   *
   * @summary 특정 폴더의 메모 조회 API
   * @param req
   * @param folderIdParam 폴더 ID
   * @returns 성공 시 특정 메모의 조회 결과를 반환합니다.
   */
  @Get('/folders/:folderId')
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
  @SuccessResponse(StatusCodes.OK, '메모 조회 성공 응답')
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
  public async handlerMemoTextImageList(
    @Request() req: ExpressRequest,
    @Path('folderId') folderIdParam: string,
  ): Promise<ITsoaSuccessResponse<MemoTextImageListResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(folderIdParam);
      const memoTextImageList = await listMemoTextImage(userId, folderId);
      return new TsoaSuccessResponse(memoTextImageList);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 이름을 수정하는 API입니다.
   *
   * @summary 메모 폴더 이름 수정 API
   * @param req
   * @param folderIdParam 폴더 ID
   * @param body 폴더 이름 수정 내용
   * @returns 성공 시 메모 폴더 이름 수정 결과를 반환합니다.
   */
  @Patch('/folders/:folderId')
  @Tags('memo-folder-controller')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '폴더 업데이트 중 오류가 발생했습니다.',
        data: {folderId: '1'},
      },
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '변경 전의 폴더 이름과 같습니다.',
        data: {folderName: 'string'},
      },
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
  @Response<ITsoaErrorResponse>(StatusCodes.CONFLICT, '중복 데이터 에러', {
    resultType: 'FAIL',
    success: null,
    error: {
      errorCode: 'FOL-409',
      reason: '이미 존재하는 폴더 이름입니다.',
      data: {folderName: 'string'},
    },
  })
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 검색 키워드 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '입력 데이터가 유효하지 않습니다.',
        data: {folderName: ' '},
      },
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST,
    '유효하지 않은 데이터 에러',
    {
      resultType: 'FAIL',
      success: null,
      error: {
        errorCode: 'FOL-400',
        reason: '폴더명을 1자 이상 입력해야 합니다.',
        data: {folderName: ''},
      },
    },
  )
  @SuccessResponse(StatusCodes.OK, '폴더 이름 수정 성공 응답')
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
  public async handlerMemoFolderUpdate(
    @Request() req: ExpressRequest,
    @Path('folderId') folderIdParam: string,
    @Body() body: BodyToMemoFolder,
  ): Promise<ITsoaSuccessResponse<MemoTextImageListResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      if (body.folderName === null || body.folderName.trim().length === 0) {
        throw new FolderValidationError({
          folderName: body.folderName,
        });
      }
      const folderId = BigInt(folderIdParam);
      const updatedMemoFolder = await memoFolderUpdate(
        userId,
        folderId,
        bodyToMemoFolder(body),
      );
      return new TsoaSuccessResponse(updatedMemoFolder);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 특정 폴더의 메모 텍스트를 수정하는 API입니다.
   *
   * @summary 특정 폴더의 메모 텍스트 수정 API
   * @param req
   * @param folderIdParam 폴더 ID
   * @param body 메모 텍스트 수정 내용
   * @returns 성공 시 메모 텍스트 수정 결과를 반환합니다.
   */
  @Patch('/folders/:folderId/text')
  @Tags('memo-folder-controller')
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
  @SuccessResponse(StatusCodes.OK, '메모 텍스트 수정 성공 응답')
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
  public async handlerMemoTextUpdate(
    @Request() req: ExpressRequest,
    @Path('folderId') folderIdParam: string,
    @Body() body: BodyToMemoTextToUpdate,
  ): Promise<ITsoaSuccessResponse<MemoTextImageListResponseDto>> {
    try {
      const userId = BigInt(req.user!.id);
      const folderId = BigInt(folderIdParam);
      const memoTextImageList = await memoTextUpdate(
        userId,
        folderId,
        bodyToMemoTextToUpdate(body),
      );
      return new TsoaSuccessResponse(memoTextImageList);
    } catch (error) {
      throw error;
    }
  }
}
