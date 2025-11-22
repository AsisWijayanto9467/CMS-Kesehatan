<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    use HasFactory;
    protected $table = 'obat';
    protected $fillable = [
        'nama',
        'kategori_id',
        'jenis_obat',
        'deskripsi',
        'efek_samping',
        'nama_produsen_importir',
        'alamat_produsen_importir',
        'nomor_registrasi',
        'gambar',
        'status_halal',
        'cara_penyimpanan',
        'aturan_penggunaan',
        'komposisi',
        'peringatan',
    ];

    protected $appends = ['gambar_url'];

    public function getGambarUrlAttribute()
    {
        if (!$this->gambar) {
            return null;
        }

        return asset('storage/' . $this->gambar);
    }


    public function dosis() {
        return $this->hasMany(DosisObat::class, 'obat_id');
    }


    public function kategori() {
        return $this->belongsTo(KategoriObat::class, 'kategori_id');
    }

    public function penyakit() {
        return $this->belongsToMany(Penyakit::class, 'rekomendasi', 'obat_id', 'penyakit_id')->withTimestamps();
    }

    public function rekomendasi() {
        return $this->hasMany(Rekomendasi::class, 'obat_id');
    }
}
