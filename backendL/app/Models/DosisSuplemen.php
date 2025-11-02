<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosisSuplemen extends Model
{
    use HasFactory;

    protected $table = 'dosis_suplemen';

    protected $fillable = [
        'suplemen_id',
        'kategori_usia',
        'dosis',
    ];

    public function suplemen() {
        return $this->belongsTo(Suplemen::class, 'suplemen_id');
    }
}
