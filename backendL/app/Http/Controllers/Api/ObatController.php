<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Obat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obats = Obat::with(['kategori', 'dosis'])->paginate(5);
        return response()->json($obats, 200);
    }

    public function all()
    {
        $obats = Obat::with(['kategori', 'dosis'])->get();
        return response()->json($obats, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->filled('dosis')) {
            $request->merge([
                'dosis' => json_decode($request->dosis, true)
            ]);
        }
        
        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori_id' => 'nullable|exists:kategori_obat,id',
            'jenis_obat' => 'required|in:bebas,bebas terbatas,keras',
            'deskripsi' => 'nullable|string',
            'efek_samping' => 'nullable|string',
            'nama_produsen_importir' => 'nullable|string|max:255',
            'alamat_produsen_importir' => 'nullable|string',
            'nomor_registrasi' => 'nullable|string',
            'status_halal' => 'required|in:halal,tidak halal,tidak diketahui',
            'cara_penyimpanan' => 'nullable|string',
            'aturan_penggunaan' => 'nullable|string',
            'komposisi' => 'nullable|string',
            'peringatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            // dosis
            'dosis' => 'required|array',
            'dosis.*.kategori_usia' => 'required|string|max:255',
            'dosis.*.dosis' => 'required|string|max:255',
        ]);

        $gambarPath = null;
        if($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('obat', 'public');
        }

        $obat = Obat::create([
            'nama' => $request->nama,
            'kategori_id' => $request->kategori_id,
            'jenis_obat' => $request->jenis_obat,
            'deskripsi' => $request->deskripsi,
            'efek_samping' => $request->efek_samping,
            'nama_produsen_importir' => $request->nama_produsen_importir,
            'alamat_produsen_importir' => $request->alamat_produsen_importir,
            'nomor_registrasi' => $request->nomor_registrasi,
            'status_halal' => $request->status_halal,
            'cara_penyimpanan' => $request->cara_penyimpanan,
            'aturan_penggunaan' => $request->aturan_penggunaan,
            'komposisi' => $request->komposisi,
            'peringatan' => $request->peringatan,
            'gambar' => $gambarPath,
        ]);

        foreach ($request->dosis as $d) {
            $obat->dosis()->create([
                'kategori_usia' => $d['kategori_usia'],
                'dosis' => $d['dosis'],
            ]);
        }

        return response()->json([
            'message' => 'Obat berhasil ditambahkan',
            'data' => $obat->load('kategori', 'dosis')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $obat = Obat::with(['kategori', 'dosis'])->findOrFail($id);
        return response()->json($obat, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $obat = Obat::findOrFail($id);

        // UBAH dosis JSON menjadi array
        if ($request->filled('dosis')) {
            $request->merge([
                'dosis' => json_decode($request->dosis, true)
            ]);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori_id' => 'nullable|exists:kategori_obat,id',
            'jenis_obat' => 'required|in:bebas,bebas terbatas,keras',
            'deskripsi' => 'nullable|string',
            'efek_samping' => 'nullable|string',
            'nama_produsen_importir' => 'nullable|string|max:255',
            'alamat_produsen_importir' => 'nullable|string',
            'nomor_registrasi' => 'nullable|string',
            'status_halal' => 'required|in:halal,tidak halal,tidak diketahui',
            'cara_penyimpanan' => 'nullable|string',
            'aturan_penggunaan' => 'nullable|string',
            'komposisi' => 'nullable|string',
            'peringatan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',

            // dosis
            'dosis' => 'required|array',
            'dosis.*.kategori_usia' => 'required|string|max:255',
            'dosis.*.dosis' => 'required|string|max:255',
        ]);

        if($request->hasFile('gambar')) {
            if($obat->gambar && file_exists(storage_path('app/public/' . $obat->gambar))) {
                unlink(storage_path('app/public/' . $obat->gambar));
            }

            $gambarPath = $request->file('gambar')->store('obat', 'public');
            $obat->gambar = $gambarPath;
        }

        $obat->update($request->except('gambar'));

        if ($request->has('dosis')) {
            $obat->dosis()->delete();

            foreach ($request->dosis as $d) {
                $obat->dosis()->create([
                    'kategori_usia' => $d['kategori_usia'],
                    'dosis' => $d['dosis'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Obat berhasil Diupdate',
            'data' => $obat->load('kategori', 'dosis')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $obat = Obat::findOrFail($id);
        if ($obat->gambar) {
            Storage::disk('public')->delete($obat->gambar);
        }
        $obat->delete();

        return response()->json([
            'message' => 'Obat berhasil Dihapus',
        ], 200);
    }
}
