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
        Schema::create('obat', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_obat')->nullOnDelete();
            $table->enum('jenis_obat', ['bebas', 'bebas terbatas', 'keras'])->default('bebas');
            $table->text('deskripsi')->nullable();
            $table->text('efek_samping')->nullable();
            $table->string('tempat_produksi')->nullable();
            $table->string('nomor_registrasi')->nullable();
            $table->string('gambar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obat');
    }
};
