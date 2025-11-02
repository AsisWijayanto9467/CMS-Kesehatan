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
        'deskripsi',
        'manfaat',
        'dosis',
        'nomor_registrasi',
        'gambar',
    ];

    public function dosis() {
        return $this->hasMany(DosisSuplemen::class, 'suplemen_id');
    }

    public function penyakit() {
        return $this->belongsToMany(Penyakit::class, 'rekomendasi', 'suplemen_id', 'penyakit_id')->withTimestamps();
    }

    public function rekomendasi() {
        return $this->hasMany(Rekomendasi::class, 'suplemen_id');
    }
}
