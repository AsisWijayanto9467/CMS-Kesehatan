<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suplemen extends Model
{
    use HasFactory;
    protected $table = 'suplemen';
    protected $fillable = [
        'nama',
        'kategori_id',
        'suplemen',
        'deskripsi',
        'manfaat',
        'dosis',
        'nomor_registrasi',
        'nama_produsen_importir',
        'alamat_produsen_importir',
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
        return $this->hasMany(DosisSuplemen::class, 'suplemen_id');
    }

    public function kategori() {
        return $this->belongsTo(KategoriSuplemen::class, 'kategori_id');
    }

    public function penyakit() {
        return $this->belongsToMany(Penyakit::class, 'rekomendasi', 'suplemen_id', 'penyakit_id')->withTimestamps();
    }

    public function rekomendasi() {
        return $this->hasMany(Rekomendasi::class, 'suplemen_id');
    }
}
