export class DateToTags {
  createdAt: Date;
  userId: bigint;
  dateExisted: boolean = true;

  constructor(userId: bigint, year: number, month: number, date?: number) {
    if (!date) {
      date = 1;
      this.dateExisted = false;
    }
    this.createdAt = new Date(Date.UTC(year, month - 1, date));
    this.userId = userId;
  }
}
