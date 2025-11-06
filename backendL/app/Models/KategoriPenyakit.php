<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriPenyakit extends Model
{
    use HasFactory;
    protected $table = 'kategori_penyakit';
    protected $fillable = [
        'nama', 
    ];

    public function obat() {
        return $this->hasMany(Penyakit::class, 'kategori_id');
    }
}
