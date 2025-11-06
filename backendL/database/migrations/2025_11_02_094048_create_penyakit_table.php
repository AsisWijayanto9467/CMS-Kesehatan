<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penyakit', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_penyakit')->nullOnDelete();
            $table->text('gejala')->nullable();
            $table->text('penyebab')->nullable();
            $table->text('keterangan')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('pencegahan')->nullable();
            $table->enum('tingkat_keparahan', ['Ringan', 'Sedang', 'Berat'])->nullable();
            $table->string('jenis_penularan')->nullable();
            $table->string('gambar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penyakit');
    }
};
