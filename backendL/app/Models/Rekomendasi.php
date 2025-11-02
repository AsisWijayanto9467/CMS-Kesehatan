<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekomendasi extends Model
{
    use HasFactory;
    protected $table = 'rekomendasi';
    protected $fillable = [
        'penyakit_id',
        'obat_id',
        'suplemen_id'
    ];

    public function penyakit() {return $this->belongsTo(Penyakit::class);}
    public function obat() {return $this->belongsTo(Obat::class);}
    public function suplemen() {return $this->belongsTo(Suplemen::class);}
}
