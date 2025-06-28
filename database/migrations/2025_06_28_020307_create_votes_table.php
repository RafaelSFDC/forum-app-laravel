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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('votable'); // Para votar em posts ou comentários
            $table->tinyInteger('type'); // 1 = upvote, -1 = downvote
            $table->timestamps();

            // Um usuário só pode votar uma vez em cada item
            $table->unique(['user_id', 'votable_id', 'votable_type']);
            $table->index(['votable_id', 'votable_type', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
