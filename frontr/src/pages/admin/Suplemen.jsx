import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import api from "../../services/api";
import Swal from "sweetalert2";
import RichText from "../../components/RichText";

const Suplemen = () => {
  const [suplemens, setSuplemens] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSuplemen, setSelectedSuplemen] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    kategori_id: "",
    deskripsi: "",
    manfaat: "",
    nomor_registrasi: "",
    nama_produsen_importir: "",
    alamat_produsen_importir: "",
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

  // ─────────────────────────────
  //   FETCH DATA API
  // ─────────────────────────────
  useEffect(() => {
    fetchSuplemens();
    fetchKategoriSuplemen();
  }, []);

  const fetchSuplemens = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/suplemen?page=${page}`);
      setSuplemens(res.data.data);
      setPagination(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data suplemen!", "error");
    }
    setLoading(false);
  };

  const filteredSuplemens = suplemens.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchKategoriSuplemen = async () => {
    try {
      const res = await api.get("/kategori-suplemen");

      // pastikan selalu array
      const list = res.data.data ?? res.data ?? [];

      setKategoris(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
      Swal.fire("Error", "Gagal mengambil kategori!", "error");
    }
  };

  // ─────────────────────────────
  //   HANDLE VALUE
  // ─────────────────────────────
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
    if (formData.dosis.length > 1) {
      const updated = formData.dosis.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, dosis: updated }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, gambar: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // ─────────────────────────────
  //   RESET FORM
  // ─────────────────────────────
  const resetForm = () => {
    setFormData({
      nama: "",
      kategori_id: "",
      deskripsi: "",
      manfaat: "",
      nomor_registrasi: "",
      nama_produsen_importir: "",
      alamat_produsen_importir: "",
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
    setSelectedSuplemen(null);
    setShowForm(false);
  };

  const closeForm = () => {
    resetForm();
  };

  // ─────────────────────────────
  //   SUBMIT FORM (CREATE & UPDATE)
  // ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "gambar") {
          if (formData.gambar instanceof File) {
            form.append("gambar", formData.gambar);
          }
        } else if (key !== "dosis") {
          form.append(key, formData[key]);
        }
      });

      form.append("dosis", JSON.stringify(formData.dosis));

      let res;
      if (editMode) {
        res = await api.post(
          `/suplemen/${selectedSuplemen.id}?_method=PUT`,
          form
        );
      } else {
        res = await api.post("/suplemen", form);
      }

      Swal.fire("Success", res.data.message, "success");
      fetchSuplemens();
      resetForm();
    } catch (error) {
      Swal.fire("Error", "Gagal menyimpan obat", "error");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  //   EDIT DATA
  // ─────────────────────────────
  const handleEdit = (item) => {
    setEditMode(true);
    setSelectedSuplemen(item);
    setShowForm(true);
    setImagePreview(item.gambar_url);

    let parsedDosis = [];

    // Jika API mengirim string JSON → parse
    if (typeof item.dosis === "string") {
      try {
        parsedDosis = Array.isArray(item.dosis)
          ? item.dosis
          : JSON.parse(item.dosis);
      } catch (error) {
        parsedDosis = [];
      }
    }
    // Jika API mengirim null → fallback default
    else if (!Array.isArray(item.dosis)) {
      parsedDosis = [];
    } else {
      parsedDosis = item.dosis;
    }

    // Jika kosong → set default
    if (parsedDosis.length === 0) {
      parsedDosis = [
        { kategori_usia: "Dewasa", dosis: "" },
        { kategori_usia: "Anak-anak", dosis: "" },
      ];
    }

    setFormData({
      nama: item.nama,
      kategori_id: item.kategori_id,
      deskripsi: item.deskripsi,
      manfaat: item.manfaat,
      nomor_registrasi: item.nomor_registrasi,
      nama_produsen_importir: item.nama_produsen_importir,
      alamat_produsen_importir: item.alamat_produsen_importir,
      status_halal: item.status_halal,
      cara_penyimpanan: item.cara_penyimpanan,
      aturan_penggunaan: item.aturan_penggunaan,
      komposisi: item.komposisi,
      peringatan: item.peringatan,
      gambar: null,
      dosis: parsedDosis,
    });
  };

  // ─────────────────────────────
  //   DELETE DATA
  // ─────────────────────────────
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus data?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/suplemen/${id}`);
      Swal.fire("Berhasil!", "Suplemen berhasil dihapus", "success");
      fetchSuplemens();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menghapus data!", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="p-1 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Suplemen</h1>
            <p className="text-gray-600">Kelola data suplemen dalam sistem</p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Suplemen
            </button>
          )}
        </div>

        {/* Form Section - Menempel langsung di halaman */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Suplemen" : "Tambah Suplemen Baru"}
              </h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md">
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
                      Nama Suplemen *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama suplemen"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Suplemen
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
                      Nomor Registrasi BPOM
                    </label>
                    <input
                      type="text"
                      name="nomor_registrasi"
                      value={formData.nomor_registrasi}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: BPOM123456789"
                    />
                  </div>

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
                      placeholder="Nama perusahaan produsen/importir"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Suplemen
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
                      Alamat Produsen/Importir
                    </label>
                    <textarea
                      name="alamat_produsen_importir"
                      value={formData.alamat_produsen_importir}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Alamat lengkap produsen/importir"
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
                      placeholder="Komposisi bahan aktif dan eksipien"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea Fields Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <RichText
                  value={formData.deskripsi}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, deskripsi: content }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manfaat
                </label>

                <RichText
                  value={formData.manfaat}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, manfaat: content }))
                  }
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
                    placeholder="Petunjuk penyimpanan suplemen"
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
                    placeholder="Cara penggunaan dan dosis yang dianjurkan"
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
                  placeholder="Peringatan dan kontraindikasi"
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dosis Penggunaan Suplemen
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
                    ? "Update Suplemen"
                    : "Simpan Suplemen"}
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
                    <i className="fas fa-capsules text-blue-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Suplemen
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {suplemens.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <i className="fas fa-leaf text-green-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Suplemen Halal
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        suplemens.filter((s) => s.status_halal === "halal")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <i className="fas fa-vial text-yellow-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Vitamin</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {suplemens.filter((s) => s.kategori_id === 1).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <i className="fas fa-bacteria text-purple-600 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Probiotik
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {suplemens.filter((s) => s.kategori_id === 3).length}
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
                  Daftar Suplemen
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
                          Suplemen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Halal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. Registrasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {suplemens.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Tidak ada data suplemen
                          </td>
                        </tr>
                      ) : (
                        filteredSuplemens.map((suplemen, index) => (
                          <tr key={suplemen.id} className="hover:bg-gray-50">
                            {/* Nomor */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>

                            {/* Nama + Gambar + Deskripsi */}
                            <td className="px-6 py-4 flex items-center space-x-3">
                              <img
                                src={suplemen.gambar_url}
                                alt={suplemen.nama}
                                className="h-24 w-24 object-cover rounded-lg border"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {suplemen.nama}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {suplemen.deskripsi
                                    ? suplemen.deskripsi.substring(0, 50) +
                                      "..."
                                    : "Tidak ada deskripsi"}
                                </div>
                              </div>
                            </td>

                            {/* Kategori */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {suplemen.kategori?.nama ||
                                  "Tidak ada kategori"}
                              </span>
                            </td>

                            {/* Halal */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  suplemen.status_halal === "halal"
                                    ? "bg-green-100 text-green-800"
                                    : suplemen.status_halal === "tidak halal"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {suplemen.status_halal}
                              </span>
                            </td>

                            {/* Nomor Registrasi */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {suplemen.nomor_registrasi || "-"}
                            </td>

                            {/* Aksi */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(suplemen)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                                >
                                  <i className="fas fa-edit"></i>
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleDelete(suplemen.id)}
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

              <div className="flex justify-center mt-6">
                <div className="flex space-x-2 p-3 bg-white shadow-md rounded-lg">
                  {pagination?.links?.map((link, i) => (
                    <button
                      key={i}
                      disabled={!link.url}
                      onClick={() => {
                        const page = new URL(link.url).searchParams.get("page");
                        fetchSuplemens(page);
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

export default Suplemen;
