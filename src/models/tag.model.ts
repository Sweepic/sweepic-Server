export interface BaseBodyToTag {
  content: string;
}

export interface BaseTagRequestDto extends BaseBodyToTag {}

export interface BodyToTag extends BaseBodyToTag {
  tag_category_id: bigint;
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
