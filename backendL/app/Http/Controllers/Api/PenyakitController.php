<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penyakit;
use Illuminate\Http\Request;

class PenyakitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $penyakit = Penyakit::with(['obat', 'suplemen'])->get();
        return response()->json([
            'success' => true,
            'data' => $penyakit
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            'nama' => 'required|string|max:255',
            'gejala' => 'nullable|string',
            'penyebab' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if($request->hasFile('gambar')) {
            $validateData['gambar'] = $request->file('gambar')->store('penyakit', 'public');
        }

        $penyakit = Penyakit::create($validateData);

        return response()->json([
            'success' => true,
            'message' => 'Data Penyakit Berhasil Ditambahkan',
            'data' => $penyakit
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $penyakit = Penyakit::with(['obat', 'suplemen'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $penyakit
        ],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $penyakit = Penyakit::findOrFail($id);

        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'gejala' => 'nullable|string',
            'penyebab' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if($request->hasFile('gambar')) {
            if($penyakit->gambar && file_exists(storage_path('app/public/' . $request->gambar))) {
                unlink(storage_path('app/public/' . $penyakit->gambar));
            }
            $validatedData['gambar'] = $request->file('gambar')->store('penyakit', 'public');
        }

        $penyakit->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Data Penyakit Berhasil DiPerbarui',
            'data' => $penyakit
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $penyakit = Penyakit::findOrFail($id);

        if($penyakit->gambar && file_exists(storage_path('app/public/' . $penyakit->gambar))) {
            unlink(storage_path('app/public/' . $penyakit->gambar));
        }

        $penyakit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penyakit berhasil dihapus'
        ], 200);
    }
}
