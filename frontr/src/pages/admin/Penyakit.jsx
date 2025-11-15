import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import Swal from "sweetalert2";

const Penyakit = () => {
  const [penyakits, setPenyakits] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [obats, setObats] = useState([]);
  const [suplemens, setSuplemens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPenyakit, setSelectedPenyakit] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    kategori_id: "",
    gejala: "",
    penyebab: "",
    keterangan: "",
    diagnosis: "",
    pencegahan: "",
    tingkat_keparahan: "",
    jenis_penularan: "",
    gambar: null,
    rekomendasi: [{ obat_id: "", suplemen_id: "" }],
  });

  // Data dummy untuk kategori penyakit
  const dummyKategoris = [
    { id: 1, nama_kategori: "Penyakit Menular" },
    { id: 2, nama_kategori: "Penyakit Tidak Menular" },
    { id: 3, nama_kategori: "Penyakit Kronis" },
    { id: 4, nama_kategori: "Penyakit Akut" },
    { id: 5, nama_kategori: "Penyakit Genetik" },
  ];

  // Data dummy untuk obat
  const dummyObats = [
    { id: 1, nama: "Paracetamol 500mg" },
    { id: 2, nama: "Amoxicillin 500mg" },
    { id: 3, nama: "Vitamin C 1000mg" },
    { id: 4, nama: "Antasida DOEN" },
    { id: 5, nama: "Cetirizine 10mg" },
  ];

  // Data dummy untuk suplemen
  const dummySuplemens = [
    { id: 1, nama: "Vitamin D3 1000IU" },
    { id: 2, nama: "Zinc Supplement" },
    { id: 3, nama: "Probiotic Capsule" },
    { id: 4, nama: "Omega-3 Fish Oil" },
    { id: 5, nama: "Multivitamin Complete" },
  ];

  // Data dummy untuk penyakit
  const dummyPenyakits = [
    {
      id: 1,
      nama: "Influenza",
      kategori_id: 1,
      gejala: "Demam, batuk, pilek, sakit tenggorokan, nyeri otot",
      penyebab: "Virus influenza",
      keterangan:
        "Penyakit pernapasan menular yang disebabkan oleh virus influenza",
      diagnosis: "Berdasarkan gejala klinis dan tes rapid influenza",
      pencegahan:
        "Vaksinasi influenza, cuci tangan rutin, hindari kontak dengan penderita",
      tingkat_keparahan: "Ringan",
      jenis_penularan: "Melalui udara dan kontak langsung",
      gambar: null,
      rekomendasi: [
        { obat_id: 1, suplemen_id: 3 },
        { obat_id: 3, suplemen_id: 1 },
      ],
      kategori: { id: 1, nama_kategori: "Penyakit Menular" },
    },
    {
      id: 2,
      nama: "Hipertensi",
      kategori_id: 2,
      gejala: "Sakit kepala, pusing, penglihatan kabur, nyeri dada",
      penyebab: "Faktor genetik, gaya hidup tidak sehat, obesitas",
      keterangan: "Tekanan darah tinggi yang menetap di atas 140/90 mmHg",
      diagnosis: "Pengukuran tekanan darah secara berkala",
      pencegahan: "Diet rendah garam, olahraga teratur, hindari stres",
      tingkat_keparahan: "Sedang",
      jenis_penularan: "Tidak menular",
      gambar: null,
      rekomendasi: [{ obat_id: 4, suplemen_id: 4 }],
      kategori: { id: 2, nama_kategori: "Penyakit Tidak Menular" },
    },
    {
      id: 3,
      nama: "Diabetes Mellitus Tipe 2",
      kategori_id: 3,
      gejala:
        "Sering haus, sering buang air kecil, penurunan berat badan, lemas",
      penyebab: "Resistensi insulin, faktor genetik, obesitas",
      keterangan: "Gangguan metabolisme glukosa kronis",
      diagnosis: "Tes gula darah puasa dan HbA1c",
      pencegahan: "Diet sehat, olahraga teratur, pertahankan berat badan ideal",
      tingkat_keparahan: "Berat",
      jenis_penularan: "Tidak menular",
      gambar: null,
      rekomendasi: [
        { obat_id: 2, suplemen_id: 5 },
        { obat_id: 5, suplemen_id: 2 },
      ],
      kategori: { id: 3, nama_kategori: "Penyakit Kronis" },
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
      setPenyakits(dummyPenyakits);
      setKategoris(dummyKategoris);
      setObats(dummyObats);
      setSuplemens(dummySuplemens);
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

  const handleRekomendasiChange = (index, field, value) => {
    const updatedRekomendasi = [...formData.rekomendasi];
    updatedRekomendasi[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      rekomendasi: updatedRekomendasi,
    }));
  };

  const addRekomendasiField = () => {
    setFormData((prev) => ({
      ...prev,
      rekomendasi: [...prev.rekomendasi, { obat_id: "", suplemen_id: "" }],
    }));
  };

  const removeRekomendasiField = (index) => {
    if (formData.rekomendasi.length > 1) {
      const updatedRekomendasi = formData.rekomendasi.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        rekomendasi: updatedRekomendasi,
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
      gejala: "",
      penyebab: "",
      keterangan: "",
      diagnosis: "",
      pencegahan: "",
      tingkat_keparahan: "",
      jenis_penularan: "",
      gambar: null,
      rekomendasi: [{ obat_id: "", suplemen_id: "" }],
    });
    setImagePreview(null);
    setEditMode(false);
    setSelectedPenyakit(null);
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
          const updatedPenyakits = penyakits.map((penyakit) =>
            penyakit.id === selectedPenyakit.id
              ? {
                  ...penyakit,
                  ...formData,
                  id: selectedPenyakit.id,
                  kategori: kategoris.find(
                    (k) => k.id === parseInt(formData.kategori_id)
                  ),
                }
              : penyakit
          );
          setPenyakits(updatedPenyakits);
          Swal.fire("Success!", "Data penyakit berhasil diupdate", "success");
        } else {
          // Tambah data dummy baru
          const newPenyakit = {
            ...formData,
            id: Date.now(), // ID unik berdasarkan timestamp
            kategori: kategoris.find(
              (k) => k.id === parseInt(formData.kategori_id)
            ),
          };
          setPenyakits((prev) => [...prev, newPenyakit]);
          Swal.fire(
            "Success!",
            "Data penyakit berhasil ditambahkan",
            "success"
          );
        }

        resetForm();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving penyakit:", error);
      Swal.fire("Error!", "Gagal menyimpan data penyakit", "error");
      setLoading(false);
    }
  };

  const handleEdit = (penyakit) => {
    setFormData({
      nama: penyakit.nama,
      kategori_id: penyakit.kategori_id || "",
      gejala: penyakit.gejala || "",
      penyebab: penyakit.penyebab || "",
      keterangan: penyakit.keterangan || "",
      diagnosis: penyakit.diagnosis || "",
      pencegahan: penyakit.pencegahan || "",
      tingkat_keparahan: penyakit.tingkat_keparahan || "",
      jenis_penularan: penyakit.jenis_penularan || "",
      gambar: null,
      rekomendasi:
        penyakit.rekomendasi && penyakit.rekomendasi.length > 0
          ? penyakit.rekomendasi
          : [{ obat_id: "", suplemen_id: "" }],
    });

    setEditMode(true);
    setSelectedPenyakit(penyakit);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data penyakit yang dihapus tidak dapat dikembalikan!",
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
        const filteredPenyakits = penyakits.filter(
          (penyakit) => penyakit.id !== id
        );
        setPenyakits(filteredPenyakits);
        Swal.fire("Deleted!", "Data penyakit berhasil dihapus", "success");
      } catch (error) {
        console.error("Error deleting penyakit:", error);
        Swal.fire("Error!", "Gagal menghapus penyakit", "error");
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

  // Helper function untuk mendapatkan nama obat/suplemen berdasarkan ID
  const getObatName = (obatId) => {
    const obat = obats.find((o) => o.id === obatId);
    return obat ? obat.nama : "Tidak diketahui";
  };

  const getSuplemenName = (suplemenId) => {
    const suplemen = suplemens.find((s) => s.id === suplemenId);
    return suplemen ? suplemen.nama : "Tidak diketahui";
  };

  return (
    <AdminLayout>
      <div className="p-6 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Penyakit
            </h1>
            <p className="text-gray-600">Kelola data penyakit dalam sistem</p>
          </div>
          {!showForm && (
            <button
              onClick={openForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
            >
              <i className="fas fa-plus"></i>
              <span>Tambah Penyakit</span>
            </button>
          )}
        </div>

        {/* Form Section - Menempel langsung di halaman */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Penyakit" : "Tambah Penyakit Baru"}
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
                      Nama Penyakit *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama penyakit"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Penyakit
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
                      Tingkat Keparahan
                    </label>
                    <select
                      name="tingkat_keparahan"
                      value={formData.tingkat_keparahan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Tingkat Keparahan</option>
                      <option value="Ringan">Ringan</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Berat">Berat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Penularan
                    </label>
                    <input
                      type="text"
                      name="jenis_penularan"
                      value={formData.jenis_penularan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: Melalui udara, kontak langsung, dll"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Penyakit
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

                {/* Kolom Kanan - Informasi Medis */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gejala
                    </label>
                    <textarea
                      name="gejala"
                      value={formData.gejala}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Deskripsikan gejala yang dialami"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penyebab
                    </label>
                    <textarea
                      name="penyebab"
                      value={formData.penyebab}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jelaskan penyebab penyakit"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea Fields Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informasi tambahan tentang penyakit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Proses diagnosis penyakit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pencegahan
                </label>
                <textarea
                  name="pencegahan"
                  value={formData.pencegahan}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Langkah-langkah pencegahan penyakit"
                />
              </div>

              {/* Rekomendasi Section */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Rekomendasi Pengobatan
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan rekomendasi obat dan suplemen untuk penyakit ini
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addRekomendasiField}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
                  >
                    <i className="fas fa-plus-circle"></i>
                    <span>Tambah Rekomendasi</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.rekomendasi.map((rekomendasi, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Rekomendasi {index + 1}
                          </span>
                        </div>
                        {formData.rekomendasi.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRekomendasiField(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Hapus rekomendasi"
                          >
                            <i className="fas fa-trash-alt text-sm"></i>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Obat Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <i className="fas fa-pills text-blue-500 text-xs"></i>
                            <span>Obat</span>
                          </label>
                          <div className="relative">
                            <select
                              value={rekomendasi.obat_id}
                              onChange={(e) =>
                                handleRekomendasiChange(
                                  index,
                                  "obat_id",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                            >
                              <option value="">Pilih Obat</option>
                              {obats.map((obat) => (
                                <option key={obat.id} value={obat.id}>
                                  {obat.nama}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          {rekomendasi.obat_id && (
                            <div className="mt-2 flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              <i className="fas fa-check-circle"></i>
                              <span>
                                Obat dipilih:{" "}
                                {getObatName(parseInt(rekomendasi.obat_id))}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Suplemen Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                            <i className="fas fa-capsules text-green-500 text-xs"></i>
                            <span>Suplemen</span>
                          </label>
                          <div className="relative">
                            <select
                              value={rekomendasi.suplemen_id}
                              onChange={(e) =>
                                handleRekomendasiChange(
                                  index,
                                  "suplemen_id",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                            >
                              <option value="">Pilih Suplemen</option>
                              {suplemens.map((suplemen) => (
                                <option key={suplemen.id} value={suplemen.id}>
                                  {suplemen.nama}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <i className="fas fa-chevron-down text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          {rekomendasi.suplemen_id && (
                            <div className="mt-2 flex items-center space-x-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              <i className="fas fa-check-circle"></i>
                              <span>
                                Suplemen dipilih:{" "}
                                {getSuplemenName(
                                  parseInt(rekomendasi.suplemen_id)
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Preview Rekomendasi */}
                      {(rekomendasi.obat_id || rekomendasi.suplemen_id) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <i className="fas fa-prescription text-blue-500 mt-0.5"></i>
                            <div className="text-sm text-blue-800">
                              <p className="font-medium">
                                Preview Rekomendasi:
                              </p>
                              <div className="mt-1 space-y-1">
                                {rekomendasi.obat_id && (
                                  <p>
                                    • <span className="font-medium">Obat:</span>{" "}
                                    {getObatName(parseInt(rekomendasi.obat_id))}
                                  </p>
                                )}
                                {rekomendasi.suplemen_id && (
                                  <p>
                                    •{" "}
                                    <span className="font-medium">
                                      Suplemen:
                                    </span>{" "}
                                    {getSuplemenName(
                                      parseInt(rekomendasi.suplemen_id)
                                    )}
                                  </p>
                                )}
                                {!rekomendasi.obat_id &&
                                  !rekomendasi.suplemen_id && (
                                    <p className="text-blue-600">
                                      Pilih obat atau suplemen untuk melihat
                                      preview
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                  {loading
                    ? "Menyimpan..."
                    : editMode
                    ? "Update Penyakit"
                    : "Simpan Penyakit"}
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
                    <i className="fas fa-virus text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Penyakit
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {penyakits.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Penyakit Menular
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {penyakits.filter((p) => p.kategori_id === 1).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fas fa-heartbeat text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Penyakit Kronis
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {penyakits.filter((p) => p.kategori_id === 3).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Tingkat Berat
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        penyakits.filter((p) => p.tingkat_keparahan === "Berat")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Penyakit
                </h2>
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
                          Nama Penyakit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tingkat Keparahan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis Penularan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {penyakits.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Tidak ada data penyakit
                          </td>
                        </tr>
                      ) : (
                        penyakits.map((penyakit, index) => (
                          <tr key={penyakit.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {penyakit.nama}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {penyakit.gejala
                                    ? penyakit.gejala.substring(0, 50) + "..."
                                    : "Tidak ada gejala"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {penyakit.kategori?.nama_kategori ||
                                  "Tidak ada kategori"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  penyakit.tingkat_keparahan === "Ringan"
                                    ? "bg-green-100 text-green-800"
                                    : penyakit.tingkat_keparahan === "Sedang"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : penyakit.tingkat_keparahan === "Berat"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {penyakit.tingkat_keparahan ||
                                  "Tidak diketahui"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {penyakit.jenis_penularan || "Tidak menular"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(penyakit)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                                >
                                  <i className="fas fa-edit"></i>
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(penyakit.id)}
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

export default Penyakit;
