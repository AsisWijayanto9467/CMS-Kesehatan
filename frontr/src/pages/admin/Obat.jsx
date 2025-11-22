import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import Swal from "sweetalert2";
import api from "../../services/api";
import RichText from "../../components/RichText";

const Obat = () => {
  const [obats, setObats] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedObat, setSelectedObat] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

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

  useEffect(() => {
    fetchKategoris();
    fetchObats();
  }, []);

  const fetchKategoris = async () => {
    try {
      const res = await api.get("/kategori-obat");
      setKategoris(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchObats = async (page = 1) => {
    try {
      setLoading(true);

      const res = await api.get(`/obat?page=${page}`);

      setObats(res.data.data); // Data obat
      setPagination(res.data); // Meta + links pagination
    } catch (error) {
      console.error("Error fetching obat:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 📌 HANDLE INPUT
  // ================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDosisChange = (index, field, value) => {
    const updated = [...formData.dosis];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, dosis: updated }));
  };

  const addDosisField = () => {
    setFormData((prev) => ({
      ...prev,
      dosis: [...prev.dosis, { kategori_usia: "", dosis: "" }],
    }));
  };

  const removeDosisField = (index) => {
    if (formData.dosis.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      dosis: prev.dosis.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, gambar: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ================================
  // 📌 RESET FORM
  // ================================
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

  // ================================
  // 📌 SUBMIT (ADD / UPDATE)
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "dosis") {
          if (key === "gambar" && !(formData.gambar instanceof File)) {
            return;
          }
          form.append(key, formData[key]);
        }
      });

      form.append("dosis", JSON.stringify(formData.dosis));

      let res;
      if (editMode) {
        res = await api.post(`/obat/${selectedObat.id}?_method=PUT`, form);
      } else {
        res = await api.post("/obat", form);
      }

      Swal.fire("Success", res.data.message, "success");
      fetchObats();
      resetForm();
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan obat", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 📌 EDIT
  // ================================
  const handleEdit = (obat) => {
    setFormData({
      ...obat,
      gambar: null,
      dosis: obat.dosis || [],
    });

    setImagePreview(obat.gambar_url);
    setSelectedObat(obat);
    setEditMode(true);
    setShowForm(true);
  };

  // ================================
  // 📌 DELETE
  // ================================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/obat/${id}`);
      Swal.fire("Berhasil", "Obat dihapus", "success");
      fetchObats();
    } catch (error) {
      Swal.fire("Error", "Gagal menghapus obat", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="p-1 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Obat</h1>
            <p className="text-gray-600">Kelola data obat dalam sistem</p>
          </div>
          {!showForm && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              onClick={() => {
                resetForm(); // opsional agar form selalu fresh
                setShowForm(true);
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Tambah Obat</span>
            </button>
          )}
        </div>

        {/* Form Section - Menempel langsung di halaman */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            {/* HEADER FORM */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Obat" : "Tambah Obat Baru"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md"
              >
                <i className="fas fa-times"></i>
                <span>Batal</span>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ========== KIRI ========== */}
                <div className="space-y-4">
                  {/* NAMA OBAT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Obat *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* KATEGORI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Obat
                    </label>
                    <select
                      name="kategori_id"
                      value={formData.kategori_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoris.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>
                          {kategori.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* JENIS OBAT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Obat *
                    </label>
                    <select
                      name="jenis_obat"
                      value={formData.jenis_obat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="bebas">Bebas</option>
                      <option value="bebas terbatas">Bebas Terbatas</option>
                      <option value="keras">Keras</option>
                    </select>
                  </div>

                  {/* STATUS HALAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Halal *
                    </label>
                    <select
                      name="status_halal"
                      value={formData.status_halal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="halal">Halal</option>
                      <option value="tidak halal">Tidak Halal</option>
                      <option value="tidak diketahui">Tidak Diketahui</option>
                    </select>
                  </div>

                  {/* NOMOR REGISTRASI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Registrasi
                    </label>
                    <input
                      type="text"
                      name="nomor_registrasi"
                      value={formData.nomor_registrasi}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* GAMBAR */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Obat
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

                {/* ========== KANAN ========== */}
                <div className="space-y-4">
                  {/* PRODUSEN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produsen/Importir
                    </label>
                    <input
                      type="text"
                      name="nama_produsen_importir"
                      value={formData.nama_produsen_importir}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* ALAMAT PRODUSEN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Produsen/Importir
                    </label>
                    <textarea
                      name="alamat_produsen_importir"
                      value={formData.alamat_produsen_importir}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* KOMPOSISI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komposisi
                    </label>
                    <textarea
                      name="komposisi"
                      value={formData.komposisi}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* ===== DESKRIPSI ===== */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi
                </label>
                <RichText 
                  value={formData.deskripsi}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, deskripsi: content }))
                  }
                />
              </div>


              {/* ===== EFEK SAMPING ===== */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Efek Samping
                </label>
                <RichText 
                  value={formData.efek_samping}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, efek_samping: content }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cara Penyimpanan
                </label>
                <textarea
                  name="cara_penyimpanan"
                  value={formData.cara_penyimpanan}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* ATURAN PENGGUNAAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aturan Penggunaan
                </label>
                <textarea
                  name="aturan_penggunaan"
                  value={formData.aturan_penggunaan}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* PERINGATAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peringatan
                </label>
                <textarea
                  name="peringatan"
                  value={formData.peringatan}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* ===== DOSIS ===== */}
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dosis Penggunaan Obat
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Atur dosis penggunaan berdasarkan kategori usia pengguna
                    </p>
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-semibold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Dosis {index + 1}
                          </span>
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
                              onChange={(e) =>
                                handleDosisChange(
                                  index,
                                  "kategori_usia",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Contoh: Dewasa, Anak-anak, Lansia, Bayi"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <i className="fas fa-user-tag text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {[
                              "Dewasa",
                              "Anak-anak (6-12 tahun)",
                              "Balita (1-5 tahun)",
                              "Bayi",
                              "Lansia (>60 tahun)",
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() =>
                                  handleDosisChange(
                                    index,
                                    "kategori_usia",
                                    suggestion
                                  )
                                }
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
                              onChange={(e) =>
                                handleDosisChange(
                                  index,
                                  "dosis",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                              placeholder="Contoh: 1x sehari 1 tablet setelah makan"
                              required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <i className="fas fa-capsules text-gray-400 text-sm"></i>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {[
                              "1x sehari 1 tablet",
                              "2x sehari 1 kapsul",
                              "3x sehari 1/2 tablet",
                              "Sesuai kebutuhan",
                              "1x sehari 1 sendok takar",
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() =>
                                  handleDosisChange(index, "dosis", suggestion)
                                }
                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 transition-colors duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Preview Dosis */}
                      {(dosis.kategori_usia || dosis.dosis) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-2 text-sm">
                            <i className="fas fa-eye text-blue-500 mt-0.5"></i>
                            <div className="text-blue-800">
                              <p className="font-medium">Preview Dosis:</p>
                              <p className="mt-1">
                                <span className="font-semibold">
                                  {dosis.kategori_usia || "Kategori Usia"}
                                </span>
                                {dosis.kategori_usia && dosis.dosis && " - "}
                                <span className="font-semibold">
                                  {dosis.dosis || "Dosis Penggunaan"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  {loading
                    ? "Menyimpan..."
                    : editMode
                    ? "Update Obat"
                    : "Simpan Obat"}
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
                    <h4 className="text-gray-700 font-semibold text-lg">
                      {obats.length}
                    </h4>
                    <p className="text-gray-500 text-sm">Total Obat</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-notes-medical text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-700 font-semibold text-lg">
                      {obats.filter((o) => o.jenis_obat === "bebas").length}
                    </h4>
                    <p className="text-gray-500 text-sm">Obat Bebas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fas fa-exclamation-circle text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-700 font-semibold text-lg">
                      {
                        obats.filter((o) => o.jenis_obat === "bebas terbatas")
                          .length
                      }
                    </h4>
                    <p className="text-gray-500 text-sm">Bebas Terbatas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <i className="fas fa-skull-crossbones text-red-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-gray-700 font-semibold text-lg">
                      {obats.filter((o) => o.jenis_obat === "keras").length}
                    </h4>
                    <p className="text-gray-500 text-sm">Obat Keras</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <div className="mb-4 mt-4">
                <div className="flex justify-center px-4">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Cari nama obat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                  <div className="ml-4 mt-2 text-sm text-gray-600">
                    Menampilkan hasil pencarian untuk:{" "}
                    <span className="font-medium">"{searchTerm}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* ================================
                      TABEL DATA OBAT
                  ================================ */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Daftar Obat
                </h3>
              </div>

              {/* Tabel */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3">Gambar</th>
                      <th className="px-6 py-3">Nama Obat</th>
                      <th className="px-6 py-3">Kategori</th>
                      <th className="px-6 py-3">Jenis</th>
                      <th className="px-6 py-3">Halal</th>
                      <th className="px-6 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6">
                          <span className="text-gray-500">Memuat data...</span>
                        </td>
                      </tr>
                    ) : obats.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6">
                          <span className="text-gray-500">
                            Belum ada data obat
                          </span>
                        </td>
                      </tr>
                    ) : (
                      obats
                        .filter((o) =>
                          o.nama
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((obat) => (
                          <tr
                            key={obat.id}
                            className="border-b hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <img
                                src={obat.gambar_url}
                                alt={obat.nama}
                                className="h-24 w-24 object-cover rounded-lg border"
                              />
                            </td>

                            <td className="px-6 py-4 font-medium">
                              {obat.nama}
                            </td>

                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {obat.kategori?.nama ||
                                  "Tidak ada kategori"}
                              </span>
                            </td>

                            <td className="px-6 py-4 capitalize">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  obat.jenis_obat === "keras"
                                    ? "bg-red-100 text-red-700"
                                    : obat.jenis_obat === "bebas terbatas"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {obat.jenis_obat}
                              </span>
                            </td>

                            <td className="px-6 py-4 capitalize">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  obat.status_halal === "halal"
                                    ? "bg-green-100 text-green-800"
                                    : obat.status_halal === "tidak halal"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {obat.status_halal}
                              </span>
                            </td>

                            {/* ACTION BUTTONS */}
                            <td className="px-6 py-4 align-middle">
                              <div className="flex items-center justify-center space-x-3">
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

              {/* Pagination (Simple) */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2 p-3 bg-white shadow-md rounded-lg">
                  {pagination?.links?.map((link, i) => (
                    <button
                      key={i}
                      disabled={!link.url}
                      onClick={() => {
                        const page = new URL(link.url).searchParams.get("page");
                        fetchObats(page);
                      }}
                      className={`px-4 py-2 border rounded-lg transition-all
                        ${
                          link.active
                            ? "bg-blue-600 text-white font-semibold"
                            : "bg-gray-100 hover:bg-gray-200"
                        }
                        ${!link.url ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Obat;
