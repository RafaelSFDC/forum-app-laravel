<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ForumController extends Controller
{
    public function index(Request $request): Response
    {
        $sort = $request->get('sort', 'recent'); // recent, popular, top
        $topicSlug = $request->get('topic');
        $search = $request->get('search');

        $query = Post::with(['user', 'topic', 'votes'])
            ->published();

        // Filtrar por busca se especificado
        if ($search) {
            $query->search($search);
        }

        // Filtrar por tópico se especificado
        if ($topicSlug) {
            $topic = Topic::where('slug', $topicSlug)->firstOrFail();
            $query->where('topic_id', $topic->id);
        }

        // Aplicar ordenação
        switch ($sort) {
            case 'popular':
                $query->popular();
                break;
            case 'top':
                $query->orderBy('votes_count', 'desc')
                      ->orderBy('created_at', 'desc');
                break;
            default:
                $query->recent();
                break;
        }

        $posts = $query->paginate(20);

        // Atualizar contadores de posts nos tópicos
        $topics = Topic::where('is_active', true)
            ->withCount('posts')
            ->orderBy('name')
            ->get()
            ->map(function ($topic) {
                $topic->posts_count = $topic->posts_count;
                return $topic;
            });

        return Inertia::render('Forum/Index', [
            'posts' => $posts,
            'topics' => $topics,
            'currentSort' => $sort,
            'currentTopic' => $topicSlug,
            'currentSearch' => $search,
        ]);
    }
}
