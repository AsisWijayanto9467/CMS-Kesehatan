import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components';
import Swal from 'sweetalert2';
import api from '../../services/api';

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Panggil semua endpoint data yang diperlukan secara paralel
      const [resObat, resPenyakit, resSuplemen] = await Promise.all([
        api.get('/all-obat'),
        api.get('/all-penyakit'),
        api.get('/all-suplemen'),
      ]);

      const extractData = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.data)) return res.data.data;
        if (res.data.data?.data) return res.data.data.data;
        return [];
      };

      const obatData = extractData(resObat);
      const penyakitData = extractData(resPenyakit);
      const suplemenData = extractData(resSuplemen);


      // Hitung statistik obat
      const obatBebasCount = obatData.filter(o => o.jenis_obat === 'bebas').length;
      const obatKerasCount = obatData.filter(o => o.jenis_obat === 'keras').length;

      // Hitung penyakit menular dan kronis (asumsi dari properti kategori atau nama)
      // Kamu bisa sesuaikan filter ini sesuai struktur data sebenarnya
      const penyakitMenularCount = penyakitData.filter(p => p.jenis_penularan && p.jenis_penularan !== '').length;
      const penyakitKronisCount = penyakitData.filter(p => p.tingkat_keparahan === 'Berat' || p.tingkat_keparahan === 'Kronis').length;

      // Hitung suplemen halal dan vitamin
      const suplemenHalalCount = suplemenData.filter(s => s.status_halal === 'halal').length;
      const suplemenVitaminCount = suplemenData.filter(s => s.suplemen && s.suplemen.toLowerCase().includes('vitamin')).length;

      // Ambil 3 terbaru berdasarkan created_at, urut descending
      const sortByDateDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at);
      const recentObat = [...obatData].sort(sortByDateDesc).slice(0, 3);
      const recentPenyakit = [...penyakitData].sort(sortByDateDesc).slice(0, 3);
      const recentSuplemen = [...suplemenData].sort(sortByDateDesc).slice(0, 3);

      setStats({
        totalObat: obatData.length,
        totalPenyakit: penyakitData.length,
        totalSuplemen: suplemenData.length,
        obatBebas: obatBebasCount,
        obatKeras: obatKerasCount,
        penyakitMenular: penyakitMenularCount,
        penyakitKronis: penyakitKronisCount,
        suplemenHalal: suplemenHalalCount,
        suplemenVitamin: suplemenVitaminCount,
        recentObat,
        recentPenyakit,
        recentSuplemen
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengambil data dashboard, silakan coba lagi.'
      });
    } finally {
      setLoading(false);
    }
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
              <span className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
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

  const ErrorContactCard = () => (
    <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
        <i className="fas fa-exclamation-triangle"></i>
        <span>Perhatian</span>
      </h3>
      <div className="space-y-2 text-sm">
        <p>• Jika terjadi hal yang salah,</p>
        <p>• Silakan hubungi admin terkait segera.</p>
        <p>• Pastikan untuk menyimpan bukti error jika ada.</p>
        <p>• Kami akan segera membantu Anda.</p>
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
            <ErrorContactCard /> 
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