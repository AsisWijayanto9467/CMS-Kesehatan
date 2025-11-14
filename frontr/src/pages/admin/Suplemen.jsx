import React from 'react';
import { AdminLayout } from '../../components';

const Suplemen = () => {
  return (
    <AdminLayout>
        <div className="p-6 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Kategori Suplemen</h1>
            <p>Halaman ini akan Membuat CRUD Kategori Suplemen dari API Laravel.</p>
        </div>
    </AdminLayout>
  )
}

export default Suplemen
