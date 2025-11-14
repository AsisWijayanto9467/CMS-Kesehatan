import React from 'react';
import { AdminLayout } from '../../components';

const Obat = () => {
  return (
     <AdminLayout>
        <div className="p-6 text-gray-800">
            <h1 className="text-2xl font-bold mb-4">Obat</h1>
            <p>Halaman ini akan Membuat CRUD Obat dari API Laravel.</p>
        </div>
    </AdminLayout>
  )
}

export default Obat
