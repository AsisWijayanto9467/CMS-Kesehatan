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
        'gejala',
        'penyebab',
        'keterangan',
        'gambar',
    ];

    public function obat() {
        return $this->belongsToMany(Obat::class, 'rekomendasi', 'penyakit_id', 'obat_id')->withTimestamps();
    }

    public function suplemen() {
        return $this->belongsToMany(Obat::class, 'rekomendasi', 'penyakit_id', 'suplemen_id')->withTimestamps();
    }

    public function rekomendasi() {
        return $this->hasMany(Rekomendasi::class, 'penyakit_id');
    }
}
