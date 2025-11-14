import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components';

const KategoriSuplemen = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [formData, setFormData] = useState({
    nama_kategori: '',
    deskripsi: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Mock data untuk simulasi (nanti bisa diganti dengan API)
  const mockData = [
    { id: 1, nama_kategori: 'Penyakit Menular', deskripsi: 'Penyakit yang dapat menular dari satu individu ke individu lain' },
    { id: 2, nama_kategori: 'Penyakit Tidak Menular', deskripsi: 'Penyakit yang tidak dapat menular antar individu' },
    { id: 3, nama_kategori: 'Penyakit Kronis', deskripsi: 'Penyakit yang berlangsung dalam waktu lama' },
  ];

  // Simulasi fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulasi API call
        setTimeout(() => {
          setKategoriList(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        // Simulasi update data
        setKategoriList(prev => 
          prev.map(item => 
            item.id === editingId 
              ? { ...item, ...formData }
              : item
          )
        );
      } else {
        // Simulasi create data
        const newKategori = {
          id: Date.now(),
          ...formData
        };
        setKategoriList(prev => [...prev, newKategori]);
      }

      // Reset form
      setFormData({
        nama_kategori: '',
        deskripsi: ''
      });
      setEditingId(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error saving data:', error);
      setIsLoading(false);
    }
  };

  const handleEdit = (kategori) => {
    setFormData({
      nama_kategori: kategori.nama_kategori,
      deskripsi: kategori.deskripsi
    });
    setEditingId(kategori.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setKategoriList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({
      nama_kategori: '',
      deskripsi: ''
    });
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 text-gray-800">
        {/* Card Form Tambah/Edit Kategori */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Kategori Penyakit' : 'Tambah Kategori Penyakit'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  name="nama_kategori"
                  value={formData.nama_kategori}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan deskripsi kategori"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan')}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Data Kategori */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Daftar Kategori Penyakit</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kategoriList.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data kategori penyakit
                      </td>
                    </tr>
                  ) : (
                    kategoriList.map((kategori, index) => (
                      <tr key={kategori.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {kategori.nama_kategori}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {kategori.deskripsi || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(kategori)}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(kategori.id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default KategoriSuplemen;
