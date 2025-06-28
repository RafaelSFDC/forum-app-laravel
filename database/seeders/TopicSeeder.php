<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            [
                'name' => 'Tecnologia',
                'slug' => 'tecnologia',
                'description' => 'Discussões sobre tecnologia, programação e inovação',
                'color' => '#3b82f6',
                'icon' => 'Laptop',
            ],
            [
                'name' => 'Jogos',
                'slug' => 'jogos',
                'description' => 'Tudo sobre videogames, reviews e discussões',
                'color' => '#8b5cf6',
                'icon' => 'Gamepad2',
            ],
            [
                'name' => 'Ciência',
                'slug' => 'ciencia',
                'description' => 'Descobertas científicas e discussões acadêmicas',
                'color' => '#10b981',
                'icon' => 'Microscope',
            ],
            [
                'name' => 'Esportes',
                'slug' => 'esportes',
                'description' => 'Notícias e discussões sobre esportes',
                'color' => '#f59e0b',
                'icon' => 'Trophy',
            ],
            [
                'name' => 'Música',
                'slug' => 'musica',
                'description' => 'Compartilhe e discuta sobre música',
                'color' => '#ef4444',
                'icon' => 'Music',
            ],
            [
                'name' => 'Filmes & TV',
                'slug' => 'filmes-tv',
                'description' => 'Reviews e discussões sobre filmes e séries',
                'color' => '#6366f1',
                'icon' => 'Film',
            ],
        ];

        foreach ($topics as $topic) {
            \App\Models\Topic::create($topic);
        }
    }
}
