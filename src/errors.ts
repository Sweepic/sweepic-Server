import {FieldErrors} from 'tsoa';

export type ErrorDetails =
  | {folderId?: string; userId?: string; folderName?: string}
  | {imageId?: string; imageUrl?: string}
  | {challengeId?: string; userId?: string}
  | {latitude?: number; longitude?: number}
  | {reason?: string}
  | {searchKeyword?: string}
  | FieldErrors
  | {extension?: string}
  | {folderId?: string; imageId?: string[]}
  | null;

// 기본 에러 클래스
export class BaseError extends Error {
  public statusCode: number;
  public code: string;
  public details: ErrorDetails = null;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: ErrorDetails,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details || null;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// 폴더 관련 에러 (FOL-Folder)
export class FolderCreationError extends BaseError {
  constructor(details: {userId: bigint; folderName: string}) {
    const errorDetails = {
      userId: details.userId.toString(),
      folderName: details.folderName,
    };
    super(400, 'FOL-400', '폴더 생성 중 오류가 발생했습니다.', errorDetails);
  }
}

export class FolderUpdateError extends BaseError {
  constructor(details: {folderId: bigint}) {
    const errorDetails = {
      folderId: details.folderId.toString(),
    };
    super(
      400,
      'FOL-400',
      '폴더 업데이트 중 오류가 발생했습니다.',
      errorDetails,
    );
  }
}

export class FolderNotFoundError extends BaseError {
  constructor(details: {folderId: bigint}) {
    const errorDetails = {
      folderId: details.folderId.toString(),
    };
    super(404, 'FOL-404', '해당 폴더를 찾을 수 없습니다.', errorDetails);
  }
}

export class FolderDuplicateError extends BaseError {
  constructor(details: {folderName: string}) {
    super(409, 'FOL-409', '이미 존재하는 폴더 이름입니다.', details);
  }
}

export class FolderNotChangeError extends BaseError {
  constructor(details: {folderId: bigint}) {
    const errorDetails = {
      folderId: details.folderId.toString(),
    };
    super(409, 'FOL-409', '이미 위치하고 있는 폴더입니다.', errorDetails);
  }
}

export class FolderNameNotChangeError extends BaseError {
  constructor(details: {folderName: string}) {
    super(400, 'FOL-400', '변경 전의 폴더 이름과 같습니다.', details);
  }
}

// 이미지 관련 에러 (IMG-Image)
export class MemoImageAdditionError extends BaseError {
  constructor(details: {folderId: bigint; imageUrl: string}) {
    const errorDetails = {
      folderId: details.folderId.toString(),
      imageUrl: details.imageUrl,
    };
    super(
      400,
      'MEM-400',
      '메모 사진 추가 중 오류가 발생했습니다.',
      errorDetails,
    );
  }
}

export class MemoImageMoveError extends BaseError {
  constructor(details: {folderId: bigint; imageId: bigint[]}) {
    const errorDetails = {
      folderId: details.folderId.toString(),
      imageId: details.imageId.map(id => id.toString()),
    };
    super(
      400,
      'MEM-400',
      '메모 사진 이동 중 오류가 발생했습니다.',
      errorDetails,
    );
  }
}

export class MemoImageDeleteError extends BaseError {
  constructor(details: null) {
    super(400, 'MEM-400', '메모 사진 삭제 중 오류가 발생했습니다.', details);
  }
}

export class OCRTextNotFoundError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(
      404,
      'IMG-404',
      'OCR 처리 결과에서 텍스트를 찾을 수 없습니다.',
      details,
    );
  }
}

export class OCRProcessError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'IMG-500', 'OCR 처리 중 오류가 발생했습니다.', details);
  }
}

// 검색/데이터 관련 에러 (SRH)
export class SearchNoResultsError extends BaseError {
  constructor(details: {searchKeyword: string}) {
    super(404, 'SRH-404', '검색 결과를 찾을 수 없습니다.', details);
  }
}

export class DataValidationError extends BaseError {
  constructor(details: {reason: string}) {
    super(400, 'SRH-400', '입력 데이터가 유효하지 않습니다.', details);
  }
}

// 생성 관련 에러 (CHL)
export class LocationChallengeCreationError extends BaseError {
  constructor(details: {reason: string}) {
    super(
      400,
      'CHL-400',
      '위치 기반 챌린지 생성 중 오류가 발생했습니다.',
      details,
    );
  }
}

// 업데이트 관련 에러 (CHL-Challenge)
export class ChallengeUpdateError extends BaseError {
  constructor(details: {challengeId: bigint; userId?: bigint}) {
    const errorDetails = {
      challengeId: details.challengeId.toString(),
      userId: details.userId?.toString(),
    };
    super(400, 'CHL-400', '챌린지 업데이트 실패.', errorDetails);
  }
}

// 삭제 관련 에러 (CHL)
export class ChallengeDeletionError extends BaseError {
  constructor(details: {challengeId: bigint}) {
    const errorDetails = {
      challengeId: details.challengeId.toString(),
    };
    super(400, 'CHL-400', '위치 기반 챌린지 삭제 실패.', errorDetails);
  }
}

// 조회 관련 에러 (CHL)
export class LocationChallengeNotFoundError extends BaseError {
  constructor(details: {challengeId: bigint}) {
    const errorDetails = {
      challengeId: details.challengeId.toString(),
    };
    super(
      404,
      'CHL-404',
      '해당 위치 기반 챌린지를 찾을 수 없습니다.',
      errorDetails,
    );
  }
}

// 챌린지 수락 관련 에러 (CHL)
export class ChallengeAcceptError extends BaseError {
  constructor(details: {challengeId: bigint; reason: string}) {
    const errorDetails = {
      challengeId: details.challengeId.toString(),
      reason: details.reason,
    };
    super(400, 'CHL-400', '해당 챌린지를 수락할 수 없습니다.', errorDetails);
  }
}

// 챌린지 완료 관련 에러 (CHL)
export class ChallengeCompleteError extends BaseError {
  constructor(details: {challengeId: bigint; reason: string}) {
    const errorDetails = {
      ...details,
      challengeId: details.challengeId.toString(),
    };
    super(400, 'CHL-400', '챌린지 완료 실패', errorDetails);
  }
}

// 챌린지 조회 관련 에러 (CHL)
export class ChallengeNotFoundError extends BaseError {
  constructor(details: {userId: bigint; reason?: string}) {
    const errorDetails = {
      userId: details.userId.toString(),
    };
    super(
      404,
      'CHL-404',
      '해당 유저의 챌린지를 찾을 수 없습니다.',
      errorDetails,
    );
  }
}

// 날짜 챌린지 생성 관련 에러 (CHL)
export class DateChallengeCreationError extends BaseError {
  constructor(details: {reason: string}) {
    super(
      400,
      'CHL-400',
      '날짜 기반 챌린지 생성 중 오류가 발생했습니다.',
      details,
    );
  }
}

// 조회 관련 에러 (CHL)
export class DateChallengeNotFoundError extends BaseError {
  constructor(details: {challengeId: bigint}) {
    const errorDetails = {
      challengeId: details.challengeId.toString(),
    };
    super(
      404,
      'CHL-404',
      '해당 날짜 기반 챌린지를 찾을 수 없습니다.',
      errorDetails,
    );
  }
}

// 챌린지 이미지 업로드 에러
export class ChallengeImageUploadError extends BaseError {
  constructor(details: {reason: string}) {
    super(400, 'CHL-400', '이미지 업로드 중 문제가 발생했습니다.', details);
  }
}

// 챌린지 이미지 존재하지 않음 에러
export class ChallengeImageMissingError extends BaseError {
  constructor(details: {reason: string}) {
    super(404, 'CHL-404', '이미지가 서버에 존재하지 않습니다.', details);
  }
}

// 네이버 API 관련 에러
export class NaverGeoCodeError extends BaseError {
  constructor(details: {reason: string}) {
    super(500, 'CHL-500', '네이버 API 호출에 문제가 있습니다.', details);
  }
}

// 히스토리 관련 에러
export class NoDataFoundError extends BaseError {
  constructor(details: {reason: string}){
    super(404, 'HIS-404', '조회를 요청한 데이터가 없습니다.', details);
  }
}

// 어워드 중복 에러
export class DuplicateAwardError extends BaseError {
  constructor(details: {reason: string}){
    super(400, 'HIS-400', '이미 해당 월의 어워드가 존재합니다.', details);
  }
}

// 어워드 업데이트 에러
export class AwardUpdateError extends BaseError {
  constructor(details: {reason: string}){
    super(400, 'HIS-400', '어워드 업데이트를 실패했습니다.', details);
  }
}

// 어워드 사진 에러
export class AwardImageError extends BaseError {
  constructor(details: {reason: string}){
    super(400, 'HIS-400', '어워드 사진 형식이 잘못되었습니다.', details);
  }
}

// 사진 데이터 관련 에러 (PHO-photo)
export class PhotoDataNotFoundError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(404, 'PHO-404', '해당 사진 데이터가 없습니다.', details);
  }
}

export class PhotoValidationError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(400, 'PHO-400', '사진 데이터가 유효하지 않습니다.', details);
  }
}

// 태그 데이터 관련 에러(TAG)
export class TagNotFound extends BaseError {
  constructor() {
    super(404, 'TAG-001', '태그가 없습니다.');
  }
}

export class TagBadRequest extends BaseError {
  constructor() {
    super(400, 'TAG-002', '잘못된 요청입니다.', null);
  }
}

// 사용자 관련 에러 (USR-User)
export class UserNotFoundError extends BaseError {
  constructor() {
    super(404, 'USR-404', '사용자를 찾을 수 없습니다.');
  }
}

export class UserCreationError extends BaseError {
  constructor() {
    super(400, 'USR-400', '사용자 생성 중 오류가 발생했습니다.');
  }
}

export class UserUpdateError extends BaseError {
  constructor() {
    super(400, 'USR-400', '사용자 정보 업데이트 실패.');
  }
}

// 인증 관련 에러 (AUT-Auth)

export class AuthError extends BaseError {
  constructor(details: {reason: string}) {
    super(401, 'AUT-401', '인증 실패.', details);
  }
}

export class SessionError extends BaseError {
  constructor(details: {reason: string}) {
    super(401, 'AUT-401', '세션 오류.', details);
  }
}

// 공용 에러
export class DBError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'DB-001', 'DB 에러입니다.', details);
  }
}

export class ServerError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'SER-001', '내부 서버 오류입니다.', details);
  }
}

// 라벨링 관련 에러 (LBL-Labeling)
export class LabelDetectionError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(500, 'LBL-500', '라벨링 처리 중 오류가 발생했습니다.', details);
  }
}

export class LabelInsufficientError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(404, 'LBL-405', '이미지에서 라벨을 감지하지 못했습니다.', details);
  }
}
