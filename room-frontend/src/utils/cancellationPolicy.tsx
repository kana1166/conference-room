// utils/cancellationPolicy.ts

function canCancelBooking(bookingStartTime: string): boolean {
  const now = new Date();
  const startTime = new Date(bookingStartTime);

  // 予約開始時間までの差分をミリ秒で計算
  const diffMs = startTime.getTime() - now.getTime();

  // 差分を分単位で計算
  const diffMinutes = diffMs / (1000 * 60);

  // 30分未満の場合はキャンセル不可
  return diffMinutes >= 30;
}

export default canCancelBooking;
