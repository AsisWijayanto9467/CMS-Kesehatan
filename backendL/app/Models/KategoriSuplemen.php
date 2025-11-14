<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriSuplemen extends Model
{
    use HasFactory;
    protected $table = 'kategori_suplemen';
    protected $fillable = [
        'nama',
        'deskripsi',
    ];

    public function suplemen() {
        return $this->hasMany(Suplemen::class, 'kategori_id');
    }
}
