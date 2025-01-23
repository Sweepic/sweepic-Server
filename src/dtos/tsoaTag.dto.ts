export class DateToTags {
  createdAt: Date;
  userId: bigint;
  dateExisted: boolean = true;

  constructor(userId: string, year: number, month: number, date?: number) {
    if (!date) {
      date = 1;
      this.dateExisted = false;
    }
    this.createdAt = new Date(year, month - 1, date);
    this.createdAt.setHours(this.createdAt.getHours() + 9);
    this.userId = BigInt(userId);
  }
}
