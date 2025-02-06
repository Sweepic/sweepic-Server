export class RequestTagSearch {
  tag: string;
  userId: bigint;

  constructor(tag: string, userId: bigint) {
    this.tag = tag;
    this.userId = userId;
  }
}
