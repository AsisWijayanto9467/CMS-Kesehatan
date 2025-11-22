// data/healthData.js
export const diseasesData = [
  {
    id: 1,
    name: 'Diabetes Melitus',
    category: 'Penyakit Kronis',
    description: 'Diabetes adalah penyakit metabolik yang ditandai dengan kadar gula darah tinggi.',
    symptoms: ['Sering haus', 'Sering buang air kecil', 'Penurunan berat badan', 'Kelelahan'],
    prevention: ['Olahraga teratur', 'Diet sehat', 'Monitor gula darah'],
    treatment: ['Obat oral', 'Insulin', 'Diet terkontrol'],
    image: '/api/placeholder/300/200',
    severity: 'Tinggi'
  },
  {
    id: 2,
    name: 'Hipertensi',
    category: 'Penyakit Jantung',
    description: 'Tekanan darah tinggi yang dapat menyebabkan komplikasi serius.',
    symptoms: ['Sakit kepala', 'Pusing', 'Mimisan', 'Nyeri dada'],
    prevention: ['Kurangi garam', 'Olahraga', 'Hindari stres'],
    treatment: ['Obat antihipertensi', 'Perubahan gaya hidup'],
    image: '/api/placeholder/300/200',
    severity: 'Sedang'
  },
  // Tambahkan data penyakit lainnya...
];

export const medicinesData = [
  {
    id: 1,
    name: 'Paracetamol',
    brand: 'Panadol',
    category: 'Analgesik',
    description: 'Obat pereda nyeri dan penurun demam.',
    dosage: '500mg 3x sehari',
    sideEffects: ['Mual', 'Ruam kulit'],
    precautions: ['Hindari alkohol', 'Jangan overdosis'],
    price: 'Rp 15.000',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Amoxicillin',
    brand: 'Amoxan',
    category: 'Antibiotik',
    description: 'Antibiotik untuk infeksi bakteri.',
    dosage: '500mg 3x sehari',
    sideEffects: ['Diare', 'Alergi'],
    precautions: ['Habiskan resep', 'Makan sebelum minum'],
    price: 'Rp 25.000',
    image: '/api/placeholder/300/200'
  },
  // Tambahkan data obat lainnya...
];

export const supplementsData = [
  {
    id: 1,
    name: 'Vitamin C 1000mg',
    brand: 'Nature\'s Way',
    category: 'Vitamin',
    description: 'Suplemen vitamin C untuk daya tahan tubuh.',
    benefits: ['Meningkatkan imunitas', 'Antioksidan'],
    dosage: '1x sehari',
    price: 'Rp 75.000',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'Omega-3 Fish Oil',
    brand: 'Blackmores',
    category: 'Minyak Ikan',
    description: 'Asam lemak omega-3 untuk kesehatan jantung.',
    benefits: ['Kesehatan jantung', 'Fungsi otak'],
    dosage: '2x sehari',
    price: 'Rp 120.000',
    image: '/api/placeholder/300/200'
  },
  // Tambahkan data suplemen lainnya...
];