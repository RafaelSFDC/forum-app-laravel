<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar tópicos primeiro
        $this->call(TopicSeeder::class);

        // Criar usuário de teste
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Criar usuários adicionais para posts
        User::factory(10)->create();

        // Criar posts de exemplo
        $this->call(PostSeeder::class);
    }
}
