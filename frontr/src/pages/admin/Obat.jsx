import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import Swal from "sweetalert2";

const Obat = () => {
  const [obats, setObats] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedObat, setSelectedObat] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    kategori_id: "",
    jenis_obat: "bebas",
    deskripsi: "",
    efek_samping: "",
    nama_produsen_importir: "",
    alamat_produsen_importir: "",
    nomor_registrasi: "",
    status_halal: "halal",
    cara_penyimpanan: "",
    aturan_penggunaan: "",
    komposisi: "",
    peringatan: "",
    gambar: null,
    dosis: [
      { kategori_usia: "Dewasa", dosis: "" },
      { kategori_usia: "Anak-anak", dosis: "" },
    ],
  });

  // Data dummy untuk kategori obat
  const dummyKategoris = [
    { id: 1, nama_kategori: "Analgesik" },
    { id: 2, nama_kategori: "Antibiotik" },
    { id: 3, nama_kategori: "Vitamin" },
    { id: 4, nama_kategori: "Antasida" },
    { id: 5, nama_kategori: "Antihistamin" },
  ];

  // Data dummy untuk obat
  const dummyObats = [
    {
      id: 1,
      nama: "Paracetamol 500mg",
      kategori_id: 1,
      jenis_obat: "bebas",
      deskripsi: "Obat pereda nyeri dan penurun demam",
      efek_samping: "Mual, ruam kulit",
      nama_produsen_importir: "PT Kimia Farma",
      alamat_produsen_importir: "Jl. Veteran No. 1, Jakarta",
      nomor_registrasi: "DKL1234567890",
      status_halal: "halal",
      cara_penyimpanan: "Simpan di tempat sejuk dan kering",
      aturan_penggunaan: "1 tablet setiap 4-6 jam",
      komposisi: "Paracetamol 500mg",
      peringatan: "Jangan melebihi dosis yang dianjurkan",
      gambar: null,
      dosis: [
        { kategori_usia: "Dewasa", dosis: "1 tablet 3x sehari" },
        { kategori_usia: "Anak-anak", dosis: "1/2 tablet 3x sehari" },
      ],
    },
    {
      id: 2,
      nama: "Amoxicillin 500mg",
      kategori_id: 2,
      jenis_obat: "keras",
      deskripsi: "Antibiotik untuk infeksi bakteri",
      efek_samping: "Diare, alergi",
      nama_produsen_importir: "PT Sanbe Farma",
      alamat_produsen_importir: "Jl. Industri No. 5, Bandung",
      nomor_registrasi: "DKL0987654321",
      status_halal: "tidak diketahui",
      cara_penyimpanan: "Simpan di bawah 30°C",
      aturan_penggunaan: "1 kapsul 3x sehari",
      komposisi: "Amoxicillin trihydrate 500mg",
      peringatan: "Habiskan seluruh resep",
      gambar: null,
      dosis: [
        { kategori_usia: "Dewasa", dosis: "1 kapsul 3x sehari" },
        { kategori_usia: "Anak-anak", dosis: "1/2 kapsul 3x sehari" },
      ],
    },
    {
      id: 3,
      nama: "Vitamin C 1000mg",
      kategori_id: 3,
      jenis_obat: "bebas",
      deskripsi: "Suplemen vitamin C dosis tinggi",
      efek_samping: "Sakit perut jika dikonsumsi berlebihan",
      nama_produsen_importir: "PT Soho Global Health",
      alamat_produsen_importir: "Jl. Hayam Wuruk No. 10, Jakarta",
      nomor_registrasi: "DKL1122334455",
      status_halal: "halal",
      cara_penyimpanan: "Simpan di tempat kering",
      aturan_penggunaan: "1 tablet sehari",
      komposisi: "Ascorbic Acid 1000mg",
      peringatan: "Konsultasi dokter untuk penderita maag",
      gambar: null,
      dosis: [
        { kategori_usia: "Dewasa", dosis: "1 tablet sehari" },
        { kategori_usia: "Anak-anak", dosis: "1/2 tablet sehari" },
      ],
    },
    {
      id: 4,
      nama: "Antasida DOEN",
      kategori_id: 4,
      jenis_obat: "bebas terbatas",
      deskripsi: "Obat maag dan gangguan lambung",
      efek_samping: "Konstipasi",
      nama_produsen_importir: "PT Kalbe Farma",
      alamat_produsen_importir: "Jl. Letjen Suprapto No. 45, Jakarta",
      nomor_registrasi: "DKL5566778899",
      status_halal: "halal",
      cara_penyimpanan: "Simpan di tempat sejuk",
      aturan_penggunaan: "1-2 tablet setelah makan",
      komposisi: "Aluminium Hydroxide, Magnesium Hydroxide",
      peringatan: "Tidak untuk penderita gangguan ginjal",
      gambar: null,
      dosis: [
        { kategori_usia: "Dewasa", dosis: "1-2 tablet setelah makan" },
        { kategori_usia: "Anak-anak", dosis: "1/2 tablet setelah makan" },
      ],
    },
  ];

  // Fetch data dummy
  useEffect(() => {
    fetchDummyData();
  }, []);

  const fetchDummyData = () => {
    setLoading(true);
    // Simulasi loading
    setTimeout(() => {
      setObats(dummyObats);
      setKategoris(dummyKategoris);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDosisChange = (index, field, value) => {
    const updatedDosis = [...formData.dosis];
    updatedDosis[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      dosis: updatedDosis,
    }));
  };

  const addDosisField = () => {
    setFormData((prev) => ({
      ...prev,
      dosis: [...prev.dosis, { kategori_usia: "", dosis: "" }],
    }));
  };

  const removeDosisField = (index) => {
    if (formData.dosis.length > 1) {
      const updatedDosis = formData.dosis.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        dosis: updatedDosis,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        gambar: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      kategori_id: "",
      jenis_obat: "bebas",
      deskripsi: "",
      efek_samping: "",
      nama_produsen_importir: "",
      alamat_produsen_importir: "",
      nomor_registrasi: "",
      status_halal: "halal",
      cara_penyimpanan: "",
      aturan_penggunaan: "",
      komposisi: "",
      peringatan: "",
      gambar: null,
      dosis: [
        { kategori_usia: "Dewasa", dosis: "" },
        { kategori_usia: "Anak-anak", dosis: "" },
      ],
    });
    setImagePreview(null);
    setEditMode(false);
    setSelectedObat(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulasi proses penyimpanan
      setTimeout(() => {
        if (editMode) {
          // Update data dummy
          const updatedObats = obats.map(obat => 
            obat.id === selectedObat.id 
              ? { ...obat, ...formData, id: selectedObat.id }
              : obat
          );
          setObats(updatedObats);
          Swal.fire("Success!", "Obat berhasil diupdate", "success");
        } else {
          // Tambah data dummy baru
          const newObat = {
            ...formData,
            id: Date.now(), // ID unik berdasarkan timestamp
          };
          setObats(prev => [...prev, newObat]);
          Swal.fire("Success!", "Obat berhasil ditambahkan", "success");
        }

        resetForm();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving obat:", error);
      Swal.fire("Error!", "Gagal menyimpan data obat", "error");
      setLoading(false);
    }
  };

  const handleEdit = (obat) => {
    setFormData({
      nama: obat.nama,
      kategori_id: obat.kategori_id || "",
      jenis_obat: obat.jenis_obat,
      deskripsi: obat.deskripsi || "",
      efek_samping: obat.efek_samping || "",
      nama_produsen_importir: obat.nama_produsen_importir || "",
      alamat_produsen_importir: obat.alamat_produsen_importir || "",
      nomor_registrasi: obat.nomor_registrasi || "",
      status_halal: obat.status_halal,
      cara_penyimpanan: obat.cara_penyimpanan || "",
      aturan_penggunaan: obat.aturan_penggunaan || "",
      komposisi: obat.komposisi || "",
      peringatan: obat.peringatan || "",
      gambar: null,
      dosis: obat.dosis && obat.dosis.length > 0 ? obat.dosis : [
        { kategori_usia: "Dewasa", dosis: "" },
        { kategori_usia: "Anak-anak", dosis: "" },
      ],
    });
    
    setEditMode(true);
    setSelectedObat(obat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data obat yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        // Hapus data dummy
        const filteredObats = obats.filter(obat => obat.id !== id);
        setObats(filteredObats);
        Swal.fire("Deleted!", "Obat berhasil dihapus", "success");
      } catch (error) {
        console.error("Error deleting obat:", error);
        Swal.fire("Error!", "Gagal menghapus obat", "error");
      }
    }
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
  };

  return (
    <AdminLayout>
      <div className="p-4 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Obat</h1>
            <p className="text-gray-600">Kelola data obat dalam sistem</p>
          </div>
          {!showForm && (
            <button
              onClick={openForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
            >
              <i className="fas fa-plus"></i>
              <span>Tambah Obat</span>
            </button>
          )}
        </div>

        {/* Form Section - Menempel langsung di halaman */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Obat" : "Tambah Obat Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md"
              >
                <i className="fas fa-times"></i>
                <span>Batal</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Obat *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Obat
                    </label>
                    <select
                      name="kategori_id"
                      value={formData.kategori_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoris.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>
                          {kategori.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Obat *
                    </label>
                    <select
                      name="jenis_obat"
                      value={formData.jenis_obat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="bebas">Bebas</option>
                      <option value="bebas terbatas">Bebas Terbatas</option>
                      <option value="keras">Keras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Halal *
                    </label>
                    <select
                      name="status_halal"
                      value={formData.status_halal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="halal">Halal</option>
                      <option value="tidak halal">Tidak Halal</option>
                      <option value="tidak diketahui">Tidak Diketahui</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Registrasi
                    </label>
                    <input
                      type="text"
                      name="nomor_registrasi"
                      value={formData.nomor_registrasi}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Obat
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produsen/Importir
                    </label>
                    <input
                      type="text"
                      name="nama_produsen_importir"
                      value={formData.nama_produsen_importir}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Produsen/Importir
                    </label>
                    <textarea
                      name="alamat_produsen_importir"
                      value={formData.alamat_produsen_importir}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komposisi
                    </label>
                    <textarea
                      name="komposisi"
                      value={formData.komposisi}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea Fields Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Efek Samping
                  </label>
                  <textarea
                    name="efek_samping"
                    value={formData.efek_samping}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cara Penyimpanan
                  </label>
                  <textarea
                    name="cara_penyimpanan"
                    value={formData.cara_penyimpanan}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aturan Penggunaan
                  </label>
                  <textarea
                    name="aturan_penggunaan"
                    value={formData.aturan_penggunaan}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peringatan
                </label>
                <textarea
                  name="peringatan"
                  value={formData.peringatan}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Dosis Section */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Dosis Obat</h3>
                    <p className="text-sm text-gray-500 mt-1">Atur dosis penggunaan obat berdasarkan kategori usia</p>
                  </div>
                  <button
                    type="button"
                    onClick={addDosisField}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
                  >
                    <i className="fas fa-plus-circle"></i>
                    <span>Tambah Dosis</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.dosis.map((dosis, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Dosis {index + 1}</span>
                        </div>
                        {formData.dosis.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDosisField(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Hapus dosis"
                          >
                            <i className="fas fa-trash-alt text-sm"></i>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Kategori Usia */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <i className="fas fa-users text-blue-500 text-xs"></i>
                            <span>Kategori Usia *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={dosis.kategori_usia}
                              onChange={(e) => handleDosisChange(index, "kategori_usia", e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Contoh: Dewasa, Anak-anak, Lansia"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <i className="fas fa-user-tag text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {['Dewasa', 'Anak-anak', 'Bayi', 'Lansia'].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleDosisChange(index, "kategori_usia", suggestion)}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dosis */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <i className="fas fa-prescription-bottle-alt text-green-500 text-xs"></i>
                            <span>Dosis Penggunaan *</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={dosis.dosis}
                              onChange={(e) => handleDosisChange(index, "dosis", e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Contoh: 1x sehari 1 tablet, 2x sehari 1 kapsul"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <i className="fas fa-capsules text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {['1x sehari 1 tablet', '2x sehari 1 kapsul', '3x sehari 1/2 tablet', 'Sesuai kebutuhan'].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleDosisChange(index, "dosis", suggestion)}
                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 transition-colors duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
                >
                  {loading ? "Menyimpan..." : editMode ? "Update Obat" : "Simpan Obat"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistics Cards - Hanya ditampilkan ketika form tidak aktif */}
        {!showForm && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <i className="fas fa-pills text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Obat</p>
                    <p className="text-2xl font-bold text-gray-900">{obats.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-capsules text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Obat Bebas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {obats.filter(o => o?.jenis_obat === 'bebas').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Obat Keras</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {obats.filter(o => o.jenis_obat === 'keras').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fas fa-ban text-red-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tidak Halal</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {obats.filter(o => o.status_halal === 'tidak halal').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Obat</h2>
              </div>

              {loading ? (
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
                          Gambar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Obat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Halal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {obats.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            Tidak ada data obat
                          </td>
                        </tr>
                      ) : (
                        obats.map((obat, index) => (
                          <tr key={obat.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <i className="fas fa-pills text-gray-400"></i>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{obat.nama}</div>
                                <div className="text-sm text-gray-500">{obat.nomor_registrasi || 'No Reg'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                obat.jenis_obat === 'bebas' ? 'bg-green-100 text-green-800' :
                                obat.jenis_obat === 'bebas terbatas' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {obat.jenis_obat}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                obat.status_halal === 'halal' ? 'bg-green-100 text-green-800' :
                                obat.status_halal === 'tidak halal' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {obat.status_halal}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(obat)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                                >
                                  <i className="fas fa-edit"></i>
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(obat.id)}
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Obat;