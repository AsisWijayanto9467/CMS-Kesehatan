<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriObat extends Model
{
    use HasFactory;
    protected $table = 'kategori_obat';
    protected $fillable = [
        'nama', 
        'keterangan',
    ];

    public function obat() {
        return $this->hasMany(Obat::class, 'kategori_id');
    }
}
