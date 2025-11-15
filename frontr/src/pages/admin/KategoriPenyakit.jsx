import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import api from "../../services/api";
import Swal from "sweetalert2";

const KategoriPenyakit = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 🔹 Ambil Data
  const fetchKategori = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/kategori-penyakit");
      if (response.data.success) {
        setKategoriList(response.data.data);
      }
    } catch (error) {
      console.error("Gagal memuat data kategori:", error.response || error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Tidak dapat memuat kategori obat. Coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // 🔹 Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const [oldCategoryName, setOldCategoryName] = useState("");

  // 🔹 Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let res;
      if (editingId) {
        // Jika sedang edit
        res = await api.put(`/kategori-penyakit/${editingId}`, formData);

        if (res.data.success) {
          await Swal.fire({
            icon: "info", // 🔵 warna biru untuk update
            title: "Kategori Diperbarui!",
            html: `Kategori <b>"${oldCategoryName}"</b> berhasil diperbarui menjadi <b>"${formData.nama}"</b>`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } else {
        // Jika tambah baru
        res = await api.post("/kategori-penyakit", formData);

        if (res.data.success) {
          await Swal.fire({
            icon: "success", // 🟢 warna hijau untuk tambah
            title: "Kategori Ditambahkan!",
            html: `Kategori <b>"${formData.nama}"</b> berhasil ditambahkan.`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }

      fetchKategori();
      setFormData({ nama: "", deskripsi: "" });
      setEditingId(null);
      setOldCategoryName("");
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan!",
        text: "Gagal menyimpan data kategori.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Edit
  const handleEdit = (kategori) => {
    setFormData({
      nama: kategori.nama,
      deskripsi: kategori.deskripsi || "",
    });
    setEditingId(kategori.id);
    setOldCategoryName(kategori.nama); // Simpan nama lama sebelum diedit
  };


  // 🔹 Hapus
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data kategori ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/kategori-penyakit/${id}`);
        if (res.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Kategori Dihapus!",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchKategori();
        }
      } catch (error) {
        console.error("Gagal menghapus kategori:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menghapus",
          text: "Terjadi kesalahan saat menghapus kategori.",
        });
      }
    }
  };

  // 🔹 Batal Edit
  const handleCancel = () => {
    setFormData({ nama: "", deskripsi: "" });
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 text-gray-800">
        {/* Form Tambah / Edit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Kategori Obat" : "Tambah Kategori Obat"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Nama Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan deskripsi kategori"
                />
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? "Menyimpan..."
                  : editingId
                  ? "Update"
                  : "Simpan"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Daftar Kategori Obat</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kategoriList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Tidak ada data kategori obat
                      </td>
                    </tr>
                  ) : (
                    kategoriList.map((kategori, index) => (
                      <tr key={kategori.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {kategori.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {kategori.deskripsi || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(kategori)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                            >
                              <i className="fas fa-edit"></i>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(kategori.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                            >
                              <i className="fas fa-trash"></i>
                              <span>Hapus</span>
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

export default KategoriPenyakit;
