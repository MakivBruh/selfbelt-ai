export const detectionTranslations = {
  en: {
    names: { driver: 'Driver', rearLeft: 'Rear left passenger', rearRight: 'Rear right passenger' },
    empty: 'seat empty', secured: 'occupied and secured',
    stopped: 'occupied and not belted while vehicle is stopped',
    moving: 'occupied and not belted while vehicle is moving',
    absent: 'absent while vehicle is moving',
    recommendations: {
      fastenBelt: 'Fasten seatbelts for every occupied seat.',
      slowDownSafely: 'Driver: reduce speed safely and stop in a safe location if needed.',
      checkDriver: 'Check driver occupancy. Do not start driving without a driver.',
    },
  },
  id: {
    names: { driver: 'Pengemudi', rearLeft: 'Penumpang belakang kiri', rearRight: 'Penumpang belakang kanan' },
    empty: 'kursi kosong', secured: 'terisi dan sabuk terpasang',
    stopped: 'terisi dan sabuk belum terpasang saat kendaraan berhenti',
    moving: 'terisi dan sabuk belum terpasang saat kendaraan bergerak',
    absent: 'tidak ada saat kendaraan bergerak',
    recommendations: {
      fastenBelt: 'Pasang sabuk pada setiap kursi yang terisi.',
      slowDownSafely: 'Pengemudi: kurangi kecepatan dengan aman dan berhenti di tempat aman bila diperlukan.',
      checkDriver: 'Periksa keberadaan pengemudi. Jangan mulai berkendara tanpa pengemudi.',
    },
  },
}
