<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosisObat extends Model
{
    use HasFactory;

    protected $table = 'dosis_obat';

    protected $fillable = [
        'obat_id',
        'kategori_usia',
        'dosis',
    ];

    public function obat() {
        return $this->belongsTo(Obat::class, 'obat_id');
    }
}
