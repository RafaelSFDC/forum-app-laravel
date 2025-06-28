<?php

use App\Models\Post;
use App\Models\Topic;
use App\Models\User;

beforeEach(function () {
    $this->artisan('migrate:fresh');
});

test('forum index loads successfully', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
});

test('search functionality works', function () {
    // Criar dados de teste
    $user = User::factory()->create();
    $topic = Topic::factory()->create(['name' => 'Teste']);

    $post1 = Post::factory()->create([
        'title' => 'Laravel é incrível',
        'content' => 'Conteúdo sobre Laravel',
        'user_id' => $user->id,
        'topic_id' => $topic->id,
    ]);

    $post2 = Post::factory()->create([
        'title' => 'React vs Vue',
        'content' => 'Comparação entre frameworks',
        'user_id' => $user->id,
        'topic_id' => $topic->id,
    ]);

    // Testar busca por título
    $response = $this->get('/?search=Laravel');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('Forum/Index')
             ->has('posts.data', 1)
             ->where('currentSearch', 'Laravel')
    );

    // Testar busca por conteúdo
    $response = $this->get('/?search=frameworks');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('Forum/Index')
             ->has('posts.data', 1)
             ->where('currentSearch', 'frameworks')
    );
});

test('topic filter works', function () {
    $user = User::factory()->create();
    $topic1 = Topic::factory()->create(['slug' => 'tecnologia']);
    $topic2 = Topic::factory()->create(['slug' => 'jogos']);

    Post::factory()->create([
        'user_id' => $user->id,
        'topic_id' => $topic1->id,
    ]);

    Post::factory()->create([
        'user_id' => $user->id,
        'topic_id' => $topic2->id,
    ]);

    // Testar filtro por tópico
    $response = $this->get('/?topic=tecnologia');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('Forum/Index')
             ->has('posts.data', 1)
             ->where('currentTopic', 'tecnologia')
    );
});

test('sort functionality works', function () {
    $user = User::factory()->create();
    $topic = Topic::factory()->create();

    $oldPost = Post::factory()->create([
        'user_id' => $user->id,
        'topic_id' => $topic->id,
        'votes_count' => 5,
        'created_at' => now()->subDays(2),
    ]);

    $newPost = Post::factory()->create([
        'user_id' => $user->id,
        'topic_id' => $topic->id,
        'votes_count' => 10,
        'created_at' => now(),
    ]);

    // Testar ordenação por recente (padrão)
    $response = $this->get('/');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('Forum/Index')
             ->where('currentSort', 'recent')
    );

    // Testar ordenação por popular
    $response = $this->get('/?sort=popular');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('Forum/Index')
             ->where('currentSort', 'popular')
    );
});
