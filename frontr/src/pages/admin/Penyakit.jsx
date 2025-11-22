import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import api from "../../services/api";
import Swal from "sweetalert2";
import RichText from "../../components/RichText";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

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

  // ======================================================
  // FETCH DATA FROM API
  // ======================================================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);

      const [p, k, o, s] = await Promise.all([
        api.get(`/penyakit?page=${page}`),
        api.get("/kategori-penyakit"),
        api.get("/all-obat"),
        api.get("/all-suplemen"),
      ]);

      setPenyakits(p.data.data.data);
      setPagination(p.data.data);
      setKategoris(k.data.data);
      setObats(o.data);
      setSuplemens(s.data);

      console.log("Data obat:", o.data);
      console.log("Data suplemen:", s.data);
      // Data obat
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Gagal memuat data dari server", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPenyakits = penyakits.filter((p) =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================================================
  // FORM INPUT HANDLING
  // ======================================================
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
      setFormData((prev) => ({
        ...prev,
        rekomendasi: prev.rekomendasi.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, gambar: file }));
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

  // ======================================================
  // SUBMIT (ADD / UPDATE)
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let form = new FormData();

      // append semua field selain rekomendasi
      Object.keys(formData).forEach((key) => {
        if (key !== "rekomendasi" && key !== "gambar") {
          form.append(key, formData[key]);
        }

        if (key === "gambar" && !(formData.gambar instanceof File)) {
          return;
        }
      });

      // Gambar
      if (formData.gambar) {
        form.append("gambar", formData.gambar);
      }

      // Rekomendasi (FORMAT BENAR UNTUK LARAVEL)
      formData.rekomendasi.forEach((rec, index) => {
        form.append(`rekomendasi[${index}][obat_id]`, rec.obat_id || "");
        form.append(
          `rekomendasi[${index}][suplemen_id]`,
          rec.suplemen_id || ""
        );
      });

      let res;

      if (editMode) {
        res = await api.post(
          `/penyakit/${selectedPenyakit.id}?_method=PUT`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire("Success!", "Data penyakit berhasil diperbarui", "success");
      } else {
        res = await api.post(`/penyakit`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success!", "Data penyakit berhasil ditambahkan", "success");
      }

      fetchData();
      resetForm();
    } catch (error) {
      console.error("ERROR RESPONSE:", error.response?.data);
      Swal.fire("Error!", "Gagal menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // EDIT (GET DETAIL BY ID)
  // ======================================================
  const handleEdit = async (penyakit) => {
    try {
      setLoading(true);

      const res = await api.get(`/penyakit/${penyakit.id}`);
      const data = res.data.data;

      setFormData({
        nama: data.nama,
        kategori_id: data.kategori_id || "",
        gejala: data.gejala || "",
        penyebab: data.penyebab || "",
        keterangan: data.keterangan || "",
        diagnosis: data.diagnosis || "",
        pencegahan: data.pencegahan || "",
        tingkat_keparahan: data.tingkat_keparahan || "",
        jenis_penularan: data.jenis_penularan || "",
        gambar: null,
        rekomendasi:
          data.rekomendasi?.length > 0
            ? data.rekomendasi.map((r) => ({
                obat_id: r.obat_id || "",
                suplemen_id: r.suplemen_id || "",
              }))
            : [{ obat_id: "", suplemen_id: "" }],
      });

      setImagePreview(data.gambar_url || null);
      setSelectedPenyakit(data);
      setEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data penyakit", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================
  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Yakin hapus?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
    });

    if (!ok.isConfirmed) return;

    try {
      await api.delete(`/penyakit/${id}`);
      Swal.fire("Deleted!", "Data berhasil dihapus", "success");
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Gagal menghapus data", "error");
    }
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
  };

  // Helper
  const getObatName = (id) => {
    const o = obats.find((x) => x.id == id);
    return o ? o.nama : "-";
  };

  const getSuplemenName = (id) => {
    const s = suplemens.find((x) => x.id == id);
    return s ? s.nama : "-";
  };

  console.log("Form rekomendasi:", formData.rekomendasi);
  console.log("Obats:", obats);
  console.log("Suplemens:", suplemens);

  return (
    <AdminLayout>
      <div className="p-1 text-gray-800">
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
                          {kategori.nama}
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
                <RichText
                  value={formData.keterangan}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, keterangan: content }))
                  }
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
                              {Array.isArray(obats) &&
                                obats.map((obat) => (
                                  <option
                                    key={obat.id}
                                    value={obat.id.toString()}
                                  >
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
                              {Array.isArray(suplemens) &&
                                suplemens.map((suplemen) => (
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

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                >
                  {loading
                    ? "Menyimpan..."
                    : editMode
                    ? "Update Penyakit"
                    : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistics Cards - Hanya ditampilkan ketika form tidak aktif */}
        {!showForm && (
          <>
            {/* ==== CARD STATISTIK ==== */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Total Penyakit */}
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

              {/* Penyakit Menular */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-shield-virus text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Penyakit Menular
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        penyakits.filter(
                          (x) => x.jenis_penularan && x.jenis_penularan !== ""
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Penyakit Kronis */}
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
                      {penyakits.filter((x) => x.kategori_id == 3).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Tingkat Berat */}
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
                        penyakits.filter((x) => x.tingkat_keparahan === "Berat")
                          .length
                      }
                    </p>
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
                        filteredPenyakits.map((p, index) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{index + 1}</td>

                            {/* Nama + Gejala */}
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {p.nama}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {p.gejala
                                    ? p.gejala.substring(0, 50) + "..."
                                    : "-"}
                                </p>
                              </div>
                            </td>

                            {/* Kategori */}
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                                {kategoris.find((k) => k.id === p.kategori_id)
                                  ?.nama || "Tidak Ada"}
                              </span>
                            </td>

                            {/* Tingkat Keparahan */}
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-xs rounded-full
                                  ${
                                    p.tingkat_keparahan === "Ringan"
                                      ? "bg-green-100 text-green-800"
                                      : p.tingkat_keparahan === "Sedang"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : p.tingkat_keparahan === "Berat"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {p.tingkat_keparahan || "-"}
                              </span>
                            </td>

                            {/* Jenis Penularan */}
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {p.jenis_penularan || "Tidak menular"}
                            </td>

                            {/* Aksi */}
                            <td className="px-6 py-4 text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                >
                                  <i className="fas fa-edit"></i> Edit
                                </button>

                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                >
                                  <i className="fas fa-trash"></i> Hapus
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
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2 p-3 bg-white shadow-md rounded-lg">
                  {pagination?.links?.map((link, i) => (
                    <button
                      key={i}
                      disabled={!link.url}
                      onClick={() => {
                        const page = new URL(link.url).searchParams.get("page");
                        fetchData(page);
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

export default Penyakit;
