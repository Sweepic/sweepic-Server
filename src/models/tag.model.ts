export interface BaseBodyToTag {
  content: string;
  tag_category_id: bigint;
}

export interface BaseTagRequestDto extends BaseBodyToTag {}

// BaseBodyToTag라 BodyToTag 내에 배열 형태로 태그를 받는다.
export interface BodyToTag {
  imageId: bigint | number;
  tags: BaseBodyToTag[];
}

export interface BodyToImageTag {
  imageId: bigint | number;
  tags: BaseBodyToTag[];
}

export interface TagRequsetDto extends BodyToTag {}

export interface ResponseFromTag {
  id: bigint;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
  tagCategoryId: bigint;
}

export interface TagResponseDto extends ResponseFromTag {}

export interface ResponseFromImageTag {
  id: String | bigint;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
  imageId: String | bigint;
  tagId: String | bigint;
}

export interface ImageTagResponseDto extends ResponseFromImageTag {}
