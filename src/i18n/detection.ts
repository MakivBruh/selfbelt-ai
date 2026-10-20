export const detectionTranslations = {
  en: {
    names: { driver: 'Driver', frontPassenger: 'Front passenger', rearLeft: 'Rear left passenger', rearRight: 'Rear right passenger' },
    empty: 'seat empty', secured: 'occupied and secured',
    stopped: 'occupied and not belted while vehicle is stopped',
    moving: 'occupied and not belted while vehicle is moving',
    absent: 'absent while vehicle is moving',
    behindBack: 'buckle latched but camera sees no belt across the body — suspected belt behind the back',
    unlatched: 'camera sees a belt across the body but the buckle is not latched',
    recommendations: {
      fastenBelt: 'Fasten seatbelts for every occupied seat.',
      slowDownSafely: 'Driver: reduce speed safely and stop in a safe location if needed.',
      checkDriver: 'Check driver occupancy. Do not start driving without a driver.',
      checkMismatch: 'Check belt routing: a latched buckle alone is insufficient. Wear the belt across the body.',
    },
  },
  id: {
    names: { driver: 'Pengemudi', frontPassenger: 'Penumpang depan', rearLeft: 'Penumpang belakang kiri', rearRight: 'Penumpang belakang kanan' },
    empty: 'kursi kosong', secured: 'terisi dan sabuk terpasang',
    stopped: 'terisi dan sabuk belum terpasang saat kendaraan berhenti',
    moving: 'terisi dan sabuk belum terpasang saat kendaraan bergerak',
    absent: 'tidak ada saat kendaraan bergerak',
    behindBack: 'pengait terkunci tetapi kamera tidak melihat sabuk melintang di badan — dugaan sabuk di belakang badan',
    unlatched: 'kamera melihat sabuk melintang di badan tetapi pengait belum terkunci',
    recommendations: {
      fastenBelt: 'Pasang sabuk pada setiap kursi yang terisi.',
      slowDownSafely: 'Pengemudi: kurangi kecepatan dengan aman dan berhenti di tempat aman bila diperlukan.',
      checkDriver: 'Periksa keberadaan pengemudi. Jangan mulai berkendara tanpa pengemudi.',
      checkMismatch: 'Periksa posisi sabuk: pengait terkunci saja belum cukup. Kenakan sabuk melintang di depan badan.',
    },
  },
}
