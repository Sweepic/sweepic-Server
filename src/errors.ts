export type ErrorDetails =
  | {folderId?: bigint; userId?: bigint; folderName?: string}
  | {imageId?: bigint; imageUrl?: string}
  | {challengeId?: bigint; userId?: bigint}
  | {latitude?: number; longitude?: number}
  | {reason?: string}
  | {searchKeyword?: string}
  | null;

// 기본 에러 클래스
export class BaseError extends Error {
  public statusCode: number;
  public code: string;
  public details: ErrorDetails;

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
    super(400, 'FOL-400', '폴더 생성 중 오류가 발생했습니다.', details);
  }
}

export class FolderNotFoundError extends BaseError {
  constructor(details: {folderId: bigint}) {
    super(404, 'FOL-404', '해당 폴더를 찾을 수 없습니다.', details);
  }
}

export class FolderDuplicateError extends BaseError {
  constructor(details: {folderName: string}) {
    super(409, 'FOL-409', '이미 존재하는 폴더 이름입니다.', details);
  }
}

// 이미지 관련 에러 (IMG-Image)
export class MemoImageAdditionError extends BaseError {
  constructor(details: {folderId: bigint; imageUrl: string}) {
    super(400, 'MEM-400', '메모 사진 추가 중 오류가 발생했습니다.', details);
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
    super(400, 'CHL-400', '챌린지 업데이트 실패.', details);
  }
}

// 삭제 관련 에러 (CHL)
export class ChallengeDeletionError extends BaseError {
  constructor(details: {challengeId: bigint}) {
    super(400, 'CHL-400', '위치 기반 챌린지 삭제 실패.', details);
  }
}

// 조회 관련 에러 (CHL)
export class LocationChallengeNotFoundError extends BaseError {
  constructor(details: {challengeId: bigint}) {
    super(404, 'CHL-404', '해당 위치 기반 챌린지를 찾을 수 없습니다.', details);
  }
}

// 챌린지 수락 관련 에러 (CHL)
export class ChallengeAcceptError extends BaseError {
  constructor(details: {challengeId: bigint; reason: string}) {
    super(400, 'CHL-400', '해당 챌린지를 수락할 수 없습니다.', details);
  }
}

// 챌린지 완료 관련 에러 (CHL)
export class ChallengeCompleteError extends BaseError {
  constructor(details: {challengeId: bigint; reason: string}){
    super(400, 'CHL-400', '챌린지 완료 실패', details);
  }
}

// 챌린지 조회 관련 에러 (CHL)
export class ChallengeNotFoundError extends BaseError {
  constructor(details: {userId: bigint}){
    super(404, 'CHL-404', '해당 유저의 챌린지를 찾을 수 없습니다.', details);
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
    super(404, 'CHL-404', '해당 날짜 기반 챌린지를 찾을 수 없습니다.', details);
  }
}

// 사진 데이터 관련 에러 (PHO-photo)
export class PhotoDataNotFoundError extends BaseError {
  constructor(details?: ErrorDetails) {
    super(404, 'PHO-404', '사진 데이터가 없습니다.', details);
  }
}
