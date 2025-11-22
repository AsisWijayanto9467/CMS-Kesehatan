// Data untuk penyakit, obat, dan suplemen
const healthData = {
    diseases: [
        {
            id: 1,
            name: 'Diabetes Melitus',
            category: 'Penyakit Kronis',
            description: 'Diabetes adalah penyakit metabolik yang ditandai dengan kadar gula darah tinggi.',
            symptoms: ['Sering haus', 'Sering buang air kecil', 'Penurunan berat badan', 'Kelelahan'],
            prevention: ['Olahraga teratur', 'Diet sehat', 'Monitor gula darah'],
            treatment: ['Obat oral', 'Insulin', 'Diet terkontrol'],
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
            severity: 'Sedang'
        },
        {
            id: 3,
            name: 'Influenza',
            category: 'Infeksi',
            description: 'Penyakit pernapasan menular yang disebabkan oleh virus influenza.',
            symptoms: ['Demam', 'Batuk', 'Sakit tenggorokan', 'Hidung tersumbat'],
            prevention: ['Vaksinasi', 'Cuci tangan', 'Hindari kerumunan'],
            treatment: ['Istirahat', 'Cairan cukup', 'Obat simptomatik'],
            severity: 'Rendah'
        },
        {
            id: 4,
            name: 'Asma',
            category: 'Pernapasan',
            description: 'Penyakit peradangan kronis saluran pernapasan.',
            symptoms: ['Sesak napas', 'Mengi', 'Batuk', 'Dada terasa sesak'],
            prevention: ['Hindari alergen', 'Olahraga teratur', 'Pengobatan rutin'],
            treatment: ['Bronkodilator', 'Kortikosteroid', 'Terapi oksigen'],
            severity: 'Sedang'
        },
        {
            id: 5,
            name: 'Gastritis',
            category: 'Penyakit Kronis',
            description: 'Peradangan pada lapisan lambung yang dapat menyebabkan nyeri dan ketidaknyamanan.',
            symptoms: ['Nyeri perut', 'Mual', 'Muntah', 'Perut kembung'],
            prevention: ['Hindari makanan pedas', 'Kurangi alkohol', 'Makan teratur'],
            treatment: ['Antasida', 'Antibiotik', 'Perubahan diet'],
            severity: 'Sedang'
        },
        {
            id: 6,
            name: 'Tuberculosis',
            category: 'Infeksi',
            description: 'Penyakit menular yang terutama menyerang paru-paru.',
            symptoms: ['Batuk berkepanjangan', 'Demam', 'Berkeringat malam', 'Penurunan berat badan'],
            prevention: ['Vaksin BCG', 'Hindari kontak', 'Ventilasi baik'],
            treatment: ['Antibiotik jangka panjang', 'Istirahat', 'Nutrisi baik'],
            severity: 'Tinggi'
        }
    ],

    medicines: [
        {
            id: 1,
            name: 'Paracetamol',
            brand: 'Panadol',
            category: 'Analgesik',
            description: 'Obat pereda nyeri dan penurun demam.',
            dosage: '500mg 3x sehari',
            sideEffects: ['Mual', 'Ruam kulit'],
            precautions: ['Hindari alkohol', 'Jangan overdosis'],
            price: 'Rp 15.000'
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
            price: 'Rp 25.000'
        },
        {
            id: 3,
            name: 'Omeprazole',
            brand: 'Losec',
            category: 'Antasida',
            description: 'Obat untuk mengurangi asam lambung.',
            dosage: '20mg 1x sehari',
            sideEffects: ['Sakit kepala', 'Mual'],
            precautions: ['Minum sebelum makan', 'Hindari alkohol'],
            price: 'Rp 45.000'
        },
        {
            id: 4,
            name: 'Salbutamol',
            brand: 'Ventolin',
            category: 'Bronkodilator',
            description: 'Obat untuk melegakan pernapasan pada asma.',
            dosage: '2-4 puff saat diperlukan',
            sideEffects: ['Jantung berdebar', 'Tremor'],
            precautions: ['Jangan overdosis', 'Konsultasi dokter'],
            price: 'Rp 35.000'
        },
        {
            id: 5,
            name: 'Metformin',
            brand: 'Glucophage',
            category: 'Antidiabetes',
            description: 'Obat untuk mengontrol gula darah pada diabetes.',
            dosage: '500mg 2x sehari',
            sideEffects: ['Mual', 'Diare'],
            precautions: ['Minum dengan makanan', 'Monitor gula darah'],
            price: 'Rp 30.000'
        },
        {
            id: 6,
            name: 'Atorvastatin',
            brand: 'Lipitor',
            category: 'Antikolesterol',
            description: 'Obat untuk menurunkan kolesterol.',
            dosage: '10mg 1x sehari',
            sideEffects: ['Nyeri otot', 'Sakit kepala'],
            precautions: ['Minum malam hari', 'Diet rendah lemak'],
            price: 'Rp 50.000'
        }
    ],

    supplements: [
        {
            id: 1,
            name: 'Vitamin C 1000mg',
            brand: 'Nature\'s Way',
            category: 'Vitamin',
            description: 'Suplemen vitamin C untuk daya tahan tubuh.',
            benefits: ['Meningkatkan imunitas', 'Antioksidan', 'Kesehatan kulit'],
            dosage: '1x sehari',
            price: 'Rp 75.000'
        },
        {
            id: 2,
            name: 'Omega-3 Fish Oil',
            brand: 'Blackmores',
            category: 'Minyak Ikan',
            description: 'Asam lemak omega-3 untuk kesehatan jantung.',
            benefits: ['Kesehatan jantung', 'Fungsi otak', 'Anti-inflamasi'],
            dosage: '2x sehari',
            price: 'Rp 120.000'
        },
        {
            id: 3,
            name: 'Calcium + Vitamin D3',
            brand: 'Youvit',
            category: 'Mineral',
            description: 'Suplemen untuk kesehatan tulang dan gigi.',
            benefits: ['Kesehatan tulang', 'Kekuatan gigi', 'Fungsi otot'],
            dosage: '1x sehari',
            price: 'Rp 65.000'
        },
        {
            id: 4,
            name: 'Probiotic',
            brand: 'Interlac',
            category: 'Probiotik',
            description: 'Bakteri baik untuk kesehatan pencernaan.',
            benefits: ['Kesehatan usus', 'Imunitas', 'Pencernaan lancar'],
            dosage: '1x sehari',
            price: 'Rp 85.000'
        },
        {
            id: 5,
            name: 'Multivitamin Complete',
            brand: 'Enervon-C',
            category: 'Multivitamin',
            description: 'Kombinasi vitamin dan mineral lengkap.',
            benefits: ['Energi tambahan', 'Imunitas', 'Kesehatan menyeluruh'],
            dosage: '1x sehari',
            price: 'Rp 95.000'
        },
        {
            id: 6,
            name: 'Zinc Supplement',
            brand: 'Nature\'s Bounty',
            category: 'Mineral',
            description: 'Suplemen zinc untuk sistem imun.',
            benefits: ['Imunitas', 'Penyembuhan luka', 'Kesehatan kulit'],
            dosage: '1x sehari',
            price: 'Rp 55.000'
        }
    ]
};