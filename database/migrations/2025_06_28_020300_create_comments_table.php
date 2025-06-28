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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade'); // Para comentários aninhados
            $table->integer('votes_count')->default(0);
            $table->integer('depth')->default(0); // Profundidade do comentário (0 = raiz)
            $table->boolean('is_deleted')->default(false); // Soft delete para manter estrutura
            $table->timestamps();

            $table->index(['post_id', 'parent_id', 'created_at']);
            $table->index(['post_id', 'votes_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
