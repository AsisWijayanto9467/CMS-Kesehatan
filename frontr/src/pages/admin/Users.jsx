import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components";
import api from "../../services/api";
import Swal from "sweetalert2";

const Users = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null); 


  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
    setEditMode(false);
    setEditId(null);
  };


  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/akun?page=${page}`);
      setUsers(res.data.data);
      setPagination(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!editMode && form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password tidak cocok",
        text: "Pastikan password dan konfirmasi password sama.",
      });
      setLoading(false);
      return;
    }

    let payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (!editMode) {
      payload.password = form.password;
      payload.confirmPassword = form.confirmPassword;
    } else {
      if (form.password.trim() !== "") {
        if (form.password !== form.confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Password tidak cocok",
            text: "Pastikan password dan konfirmasi password sama.",
          });
          setLoading(false);
          return;
        }
        payload.password = form.password;
        payload.confirmPassword = form.confirmPassword;
      }
    }

    try {
      if (!editMode) {
        await api.post("/createUser", payload);
        Swal.fire({
          icon: "success",
          title: "User berhasil ditambahkan!",
        });
      } else {
        await api.put(`/updateUser/${editId}`, payload);
        Swal.fire({
          icon: "success",
          title: "User berhasil diperbarui!",
        });
      }
      resetForm();
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan user",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus User?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/deleteUser/${id}`);

      Swal.fire({
        icon: "success",
        title: "User berhasil dihapus!",
      });

      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus user",
        text: error.response?.data?.message,
      });
    }
  };




  return (
    <AdminLayout>
      <div className="p-1 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
            <p className="text-gray-600">Kelola data user dalam sistem</p>
          </div>

          {!showForm && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Tambah User</span>
            </button>
          )}
        </div>

        {/* Form Section - Menempel langsung di halaman */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Tambah User Baru</h2>

            <form onSubmit={handleSubmit}>
              {/* NAMA */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* ROLE */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>


              {/* PASSWORD */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required={!editMode}
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required={!editMode} // kalau edit boleh kosong
                />
              </div>


              {/* BUTTONS */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Statistics Cards - Hanya ditampilkan ketika form tidak aktif */}
        {!showForm && (
          <>
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
            {/* Tabel */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar User
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
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Tidak ada data user
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.role}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center space-x-1 text-xs"
                                >
                                  <i className="fas fa-edit"></i>
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleDelete(user.id)}
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

              {/* Pagination (Simple) */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2 p-3 bg-white shadow-md rounded-lg">
                  {pagination?.links?.map((link, i) => (
                    <button
                      key={i}
                      disabled={!link.url}
                      onClick={() => {
                        const page = new URL(link.url).searchParams.get("page");
                        fetchUsers(page);
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

export default Users;
