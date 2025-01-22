export interface OCRRequest {
  folder_id?: number; // 폴더 ID (선택적, PATCH 요청에서 사용)
  image_url: string; // 이미지 URL
  user_id: number; // 사용자 ID
  folder_name?: string; // 새 폴더 이름 (POST 요청에서 사용)
}

export interface OCRResponse {
  user_id: bigint; // 사용자 ID
  folder_id: string; // 폴더 ID
  folder_name?: string; // 폴더 이름
  imageText?: string; // OCR 텍스트
  image_url?: string; // 이미지 URL (이미지 응답에서 사용)
}
