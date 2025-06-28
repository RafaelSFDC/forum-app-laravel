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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content')->nullable();
            $table->string('type')->default('text'); // text, link, image
            $table->string('url')->nullable(); // Para posts de link
            $table->string('image_url')->nullable(); // Para posts de imagem
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('topic_id')->constrained()->onDelete('cascade');
            $table->integer('votes_count')->default(0); // Soma dos votos (upvotes - downvotes)
            $table->integer('comments_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['topic_id', 'created_at']);
            $table->index(['votes_count', 'created_at']);
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
