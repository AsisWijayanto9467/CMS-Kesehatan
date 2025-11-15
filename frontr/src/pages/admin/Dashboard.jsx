import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalObat: 0,
    totalPenyakit: 0,
    totalSuplemen: 0,
    obatBebas: 0,
    obatKeras: 0,
    penyakitMenular: 0,
    penyakitKronis: 0,
    suplemenHalal: 0,
    suplemenVitamin: 0,
    recentObat: [],
    recentPenyakit: [],
    recentSuplemen: []
  });

  const [loading, setLoading] = useState(true);

  // Data dummy untuk dashboard
  const dummyData = {
    obat: [
      { id: 1, nama: 'Paracetamol 500mg', jenis_obat: 'bebas', created_at: '2024-01-15' },
      { id: 2, nama: 'Amoxicillin 500mg', jenis_obat: 'keras', created_at: '2024-01-14' },
      { id: 3, nama: 'Vitamin C 1000mg', jenis_obat: 'bebas', created_at: '2024-01-13' },
      { id: 4, nama: 'Antasida DOEN', jenis_obat: 'bebas terbatas', created_at: '2024-01-12' },
    ],
    penyakit: [
      { id: 1, nama: 'Influenza', tingkat_keparahan: 'Ringan', created_at: '2024-01-15' },
      { id: 2, nama: 'Hipertensi', tingkat_keparahan: 'Sedang', created_at: '2024-01-14' },
      { id: 3, nama: 'Diabetes Mellitus', tingkat_keparahan: 'Berat', created_at: '2024-01-13' },
    ],
    suplemen: [
      { id: 1, nama: 'Vitamin C 1000mg', status_halal: 'halal', created_at: '2024-01-15' },
      { id: 2, nama: 'Zinc Supplement', status_halal: 'halal', created_at: '2024-01-14' },
      { id: 3, nama: 'Probiotic Capsule', status_halal: 'tidak diketahui', created_at: '2024-01-13' },
      { id: 4, nama: 'Omega-3 Fish Oil', status_halal: 'tidak halal', created_at: '2024-01-12' },
    ]
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    
    // Simulasi API call
    setTimeout(() => {
      const statsData = {
        totalObat: dummyData.obat.length,
        totalPenyakit: dummyData.penyakit.length,
        totalSuplemen: dummyData.suplemen.length,
        obatBebas: dummyData.obat.filter(o => o.jenis_obat === 'bebas').length,
        obatKeras: dummyData.obat.filter(o => o.jenis_obat === 'keras').length,
        penyakitMenular: 1, // Asumsi dari data dummy
        penyakitKronis: 2, // Asumsi dari data dummy
        suplemenHalal: dummyData.suplemen.filter(s => s.status_halal === 'halal').length,
        suplemenVitamin: 2, // Asumsi dari data dummy
        recentObat: dummyData.obat.slice(0, 3),
        recentPenyakit: dummyData.penyakit.slice(0, 3),
        recentSuplemen: dummyData.suplemen.slice(0, 3)
      };
      
      setStats(statsData);
      setLoading(false);
    }, 1000);
  };

  const StatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? '...' : value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );

  const RecentItemCard = ({ title, items, type, emptyMessage }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <i className={`fas ${type === 'obat' ? 'fa-pills' : type === 'penyakit' ? 'fa-virus' : 'fa-capsules'} text-blue-500`}></i>
        <span>{title}</span>
      </h3>
      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.nama}</p>
                  <p className="text-xs text-gray-500">
                    {type === 'obat' && `Jenis: ${item.jenis_obat}`}
                    {type === 'penyakit' && `Tingkat: ${item.tingkat_keparahan}`}
                    {type === 'suplemen' && `Status: ${item.status_halal}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{item.created_at}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const QuickActionCard = () => (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <i className="fas fa-bolt"></i>
        <span>Quick Actions</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => window.location.href = '/admin/obat'}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Tambah Obat</span>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/penyakit'}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Tambah Penyakit</span>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/suplemen'}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Tambah Suplemen</span>
        </button>
        <button 
          onClick={() => window.location.href = '/admin/kategori'}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i className="fas fa-layer-group"></i>
          <span>Kelola Kategori</span>
        </button>
      </div>
    </div>
  );

  const HealthTipCard = () => (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
        <i className="fas fa-lightbulb"></i>
        <span>Health Tips</span>
      </h3>
      <div className="space-y-2">
        <p className="text-sm">• Simpan obat di tempat sejuk dan kering</p>
        <p className="text-sm">• Periksa tanggal kadaluarsa secara berkala</p>
        <p className="text-sm">• Konsultasi dokter sebelum menggunakan obat keras</p>
        <p className="text-sm">• Baca aturan pakai dengan teliti</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600">Overview sistem manajemen kesehatan</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Obat"
            value={stats.totalObat}
            icon="fa-pills"
            color="bg-blue-500"
            description="Semua jenis obat"
          />
          <StatCard
            title="Total Penyakit"
            value={stats.totalPenyakit}
            icon="fa-virus"
            color="bg-red-500"
            description="Data penyakit terdaftar"
          />
          <StatCard
            title="Total Suplemen"
            value={stats.totalSuplemen}
            icon="fa-capsules"
            color="bg-green-500"
            description="Suplemen kesehatan"
          />
          <StatCard
            title="Obat Bebas"
            value={stats.obatBebas}
            icon="fa-shopping-cart"
            color="bg-emerald-500"
            description="Dapat dibeli bebas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Obat Keras"
            value={stats.obatKeras}
            icon="fa-exclamation-triangle"
            color="bg-amber-500"
            description="Harus dengan resep"
          />
          <StatCard
            title="Penyakit Menular"
            value={stats.penyakitMenular}
            icon="fa-biohazard"
            color="bg-orange-500"
            description="Dapat menular"
          />
          <StatCard
            title="Suplemen Halal"
            value={stats.suplemenHalal}
            icon="fa-check-circle"
            color="bg-teal-500"
            description="Bersertifikat halal"
          />
          <StatCard
            title="Suplemen Vitamin"
            value={stats.suplemenVitamin}
            icon="fa-apple-alt"
            color="bg-purple-500"
            description="Jenis vitamin"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Items */}
          <div className="lg:col-span-2 space-y-6">
            <RecentItemCard
              title="Obat Terbaru"
              items={stats.recentObat}
              type="obat"
              emptyMessage="Belum ada data obat"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentItemCard
                title="Penyakit Terbaru"
                items={stats.recentPenyakit}
                type="penyakit"
                emptyMessage="Belum ada data penyakit"
              />
              <RecentItemCard
                title="Suplemen Terbaru"
                items={stats.recentSuplemen}
                type="suplemen"
                emptyMessage="Belum ada data suplemen"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActionCard />
            <HealthTipCard />
            
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <i className="fas fa-server text-gray-500"></i>
                <span>System Status</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center space-x-1 text-green-600">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">Online</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="text-sm text-gray-600">1.2 GB / 5 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Aktivitas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalObat}</div>
              <div className="text-sm text-gray-600">Obat Tersedia</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.totalPenyakit}</div>
              <div className="text-sm text-gray-600">Penyakit Terdaftar</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.totalSuplemen}</div>
              <div className="text-sm text-gray-600">Suplemen Aktif</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.obatBebas + stats.obatKeras}</div>
              <div className="text-sm text-gray-600">Total Jenis Obat</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}