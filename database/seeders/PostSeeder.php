<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();
        $topics = \App\Models\Topic::all();

        $posts = [
            [
                'title' => 'Laravel 11 foi lançado! Principais novidades',
                'content' => 'O Laravel 11 trouxe várias melhorias importantes, incluindo melhor performance, novos recursos de cache e muito mais. Vamos discutir as principais mudanças.',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'tecnologia')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(10, 100),
                'comments_count' => rand(5, 25),
                'views_count' => rand(100, 1000),
                'published_at' => now()->subHours(rand(1, 48)),
            ],
            [
                'title' => 'React 19 Beta - Novas funcionalidades',
                'content' => 'O React 19 está em beta e trouxe recursos incríveis como Server Components melhorados e novas APIs. O que vocês acham?',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'tecnologia')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(5, 80),
                'comments_count' => rand(3, 20),
                'views_count' => rand(50, 800),
                'published_at' => now()->subHours(rand(1, 72)),
            ],
            [
                'title' => 'Cyberpunk 2077: Vale a pena jogar em 2024?',
                'content' => 'Depois de todas as atualizações e correções, o jogo está finalmente jogável? Compartilhem suas experiências!',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'jogos')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(15, 120),
                'comments_count' => rand(8, 35),
                'views_count' => rand(200, 1500),
                'published_at' => now()->subHours(rand(1, 24)),
            ],
            [
                'title' => 'Descoberta de nova espécie de dinossauro no Brasil',
                'content' => 'Paleontólogos brasileiros descobriram uma nova espécie de dinossauro no interior de São Paulo. A descoberta pode mudar nossa compreensão sobre a evolução.',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'ciencia')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(20, 90),
                'comments_count' => rand(10, 30),
                'views_count' => rand(300, 1200),
                'published_at' => now()->subHours(rand(1, 96)),
            ],
            [
                'title' => 'Copa do Mundo 2026: Expectativas para a seleção brasileira',
                'content' => 'Com a Copa do Mundo se aproximando, quais são as expectativas para o Brasil? Quem deveria ser convocado?',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'esportes')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(25, 150),
                'comments_count' => rand(15, 40),
                'views_count' => rand(400, 2000),
                'published_at' => now()->subHours(rand(1, 120)),
            ],
            [
                'title' => 'Álbum novo do Radiohead: Primeiras impressões',
                'content' => 'Acabei de ouvir o novo álbum do Radiohead e estou impressionado. A evolução sonora da banda continua surpreendente.',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'musica')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(8, 60),
                'comments_count' => rand(5, 18),
                'views_count' => rand(80, 600),
                'published_at' => now()->subHours(rand(1, 168)),
            ],
            [
                'title' => 'The Last of Us Parte 3: Rumores e especulações',
                'content' => 'Surgiram novos rumores sobre o desenvolvimento de The Last of Us Parte 3. O que vocês gostariam de ver na continuação?',
                'type' => 'text',
                'topic_id' => $topics->where('slug', 'jogos')->first()->id,
                'user_id' => $users->random()->id,
                'votes_count' => rand(30, 200),
                'comments_count' => rand(20, 50),
                'views_count' => rand(500, 2500),
                'is_pinned' => true,
                'published_at' => now()->subHours(rand(1, 48)),
            ],
        ];

        foreach ($posts as $postData) {
            \App\Models\Post::create($postData);
        }
    }
}
