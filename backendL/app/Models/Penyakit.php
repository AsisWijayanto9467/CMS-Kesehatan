<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penyakit extends Model
{
    use HasFactory;
    protected $table = 'penyakit';
    protected $fillable = [
        'nama',
        'kategori_id',
        'gejala',
        'penyebab',
        'keterangan',
        'diagnosis',
        'pencegahan',
        'tingkat_keparahan',
        'jenis_penularan',
        'gambar',
    ];

    public function obat() {
        return $this->belongsToMany(Obat::class, 'rekomendasi', 'penyakit_id', 'obat_id')->withTimestamps();
    }

    public function kategori() {
        return $this->belongsTo(KategoriPenyakit::class, 'kategori_id');
    }

    public function suplemen() {
        return $this->belongsToMany(Suplemen::class, 'rekomendasi', 'penyakit_id', 'suplemen_id')->withTimestamps();
    }

    public function rekomendasi() {
        return $this->hasMany(Rekomendasi::class, 'penyakit_id');
    }
}
