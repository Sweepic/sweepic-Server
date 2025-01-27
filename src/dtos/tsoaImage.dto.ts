export class RequestTagSearch {
  tag: string;
  userId: bigint;

  constructor(tag: string, userId: string) {
    this.tag = tag;
    this.userId = BigInt(userId);
  }
}
