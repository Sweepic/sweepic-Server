export class RequestTagSearch {
  tag: string;
  userId: bigint;

  constructor(tag: string, userId: bigint) {
    this.tag = tag;
    this.userId = userId;
  }
}

interface RequestBodyToImageData {
  mediaId: string;
  timestamp: Date;
}

export class RequestImageData {
  mediaId: bigint;
  createdAt: Date;
  userId: bigint;

  constructor(body: RequestBodyToImageData, userId: bigint) {
    this.mediaId = BigInt(body.mediaId);
    this.createdAt = body.timestamp;
    this.userId = userId;
  }
}
