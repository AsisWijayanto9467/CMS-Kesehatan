<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suplemen;
use Illuminate\Http\Request;

class SuplemenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suplemens = Suplemen::with(['kategori', 'dosis'])->get();
        return response()->json($suplemens, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori_id' => 'nullable|exists:kategori_suplemen,id',
            'deskripsi' => 'nullable|string',
            'manfaat' => 'nullable|string',
            'nomor_registrasi' => 'nullable|string|max:255',
            'nama_produsen_importir' => 'nullable|string|max:255',
            'alamat_produsen_importir' => 'nullable|string',
            'status_halal' => 'required|in:halal,tidak halal,tidak diketahui',
            'cara_penyimpanan' => 'nullable|string',
            'aturan_penggunaan' => 'nullable|string',
            'komposisi' => 'nullable|string',
            'peringatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            // Dosis
            'dosis' => 'required|array',
            'dosis.*.kategori_usia' => 'required|string|max:255',
            'dosis.*.dosis' => 'required|string|max:255',
        ]);

        $gambarPath = null;
        if($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('suplemen', 'public');
        }

        $suplemen = Suplemen::create([
            'nama' => $request->nama,
            'kategori_id' => $request->kategori_id,
            'deskripsi' => $request->deskripsi,
            'manfaat' => $request->manfaat,
            'nomor_registrasi' => $request->nomor_registrasi,
            'nama_produsen_importir' => $request->nama_produsen_importir,
            'alamat_produsen_importir' => $request->alamat_produsen_importir,
            'status_halal' => $request->status_halal,
            'cara_penyimpanan' => $request->cara_penyimpanan,
            'aturan_penggunaan' => $request->aturan_penggunaan,
            'komposisi' => $request->komposisi,
            'peringatan' => $request->peringatan,
            'gambar' => $gambarPath,
        ]);

        foreach ($request->dosis as $d) {
            $suplemen->dosis()->create([
                'kategori_usia' => $d['kategori_usia'],
                'dosis' => $d['dosis'],
            ]);
        }

        return response()->json([
            'message' => 'Suplemen berhasil ditambahkan',
            'data' => $suplemen->load('kategori','dosis'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $suplemen = Suplemen::with(['kategori', 'dosis'])->findOrFail($id);
        return response()->json($suplemen, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $suplemen = Suplemen::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori_id' => 'nullable|exists:kategori_suplemen,id',
            'deskripsi' => 'nullable|string',
            'manfaat' => 'nullable|string',
            'nomor_registrasi' => 'nullable|string|max:255',
            'nama_produsen_importir' => 'nullable|string|max:255',
            'alamat_produsen_importir' => 'nullable|string',
            'status_halal' => 'required|in:halal,tidak halal,tidak diketahui',
            'cara_penyimpanan' => 'nullable|string',
            'aturan_penggunaan' => 'nullable|string',
            'komposisi' => 'nullable|string',
            'peringatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            // Dosis
            'dosis' => 'required|array',
            'dosis.*.kategori_usia' => 'required|string|max:255',
            'dosis.*.dosis' => 'required|string|max:255',
        ]);

        if ($request->hasFile('gambar')) {
            if ($suplemen->gambar && file_exists(storage_path('app/public/' . $suplemen->gambar))) {
                unlink(storage_path('app/public/' . $suplemen->gambar));
            }
            $suplemen->gambar = $request->file('gambar')->store('suplemen', 'public');
        }

        $suplemen->update($request->except('gambar', 'dosis'));

        if($request->has('dosis')) {
            $suplemen->dosis()->delete();

            foreach($request->dosis as $d) {
                $suplemen->dosis()->create([
                    'kategori_usia' => $d['kategori_usia'],
                    'dosis' => $d['dosis']
                ]);
            }
        }

        return response()->json([
            'message' => "Suplemen berhasil diupdate",
            'data' => $suplemen->load('kategori', 'dosis')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $suplemen = Suplemen::findOrFail($id);

        if($suplemen->gambar && file_exists(storage_path('app/public/' . $suplemen->gambar))) {
            unlink(storage_path('app/public/' . $suplemen->gambar));
        }

        $suplemen->delete();

        return response()->json([
            'message' => "Suplemen berhasil Dihapus",
        ], 200);
    }
}
