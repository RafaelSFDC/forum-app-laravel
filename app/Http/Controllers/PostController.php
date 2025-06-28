<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostView;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function create(): Response
    {
        $topics = Topic::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Post/Create', [
            'topics' => $topics,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'nullable|string|max:10000',
            'type' => 'required|in:text,link,image',
            'url' => 'nullable|url|max:500',
            'image_url' => 'nullable|url|max:500',
            'topic_id' => 'required|exists:topics,id',
        ]);

        // Validações específicas por tipo
        if ($request->type === 'link' && !$request->url) {
            return back()->withErrors(['url' => 'URL é obrigatória para posts de link.']);
        }

        if ($request->type === 'image' && !$request->image_url) {
            return back()->withErrors(['image_url' => 'URL da imagem é obrigatória para posts de imagem.']);
        }

        if ($request->type === 'text' && !$request->content) {
            return back()->withErrors(['content' => 'Conteúdo é obrigatório para posts de texto.']);
        }

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'type' => $request->type,
            'url' => $request->url,
            'image_url' => $request->image_url,
            'user_id' => Auth::id(),
            'topic_id' => $request->topic_id,
        ]);

        // Incrementar contador de posts no tópico
        $topic = Topic::find($request->topic_id);
        $topic->increment('posts_count');

        return redirect()->route('post.show', $post->slug)
            ->with('success', 'Post criado com sucesso!');
    }

    public function show(string $slug): Response
    {
        $post = Post::with([
            'user',
            'topic',
            'votes' => function ($query) {
                if (Auth::check()) {
                    $query->where('user_id', Auth::id());
                }
            },
            'comments' => function ($query) {
                $query->with([
                    'user',
                    'votes' => function ($voteQuery) {
                        if (Auth::check()) {
                            $voteQuery->where('user_id', Auth::id());
                        }
                    }
                ])
                ->whereNull('parent_id')
                ->orderBy('votes_count', 'desc')
                ->orderBy('created_at', 'asc');
            },
            'comments.replies' => function ($query) {
                $query->with([
                    'user',
                    'votes' => function ($voteQuery) {
                        if (Auth::check()) {
                            $voteQuery->where('user_id', Auth::id());
                        }
                    }
                ])
                ->orderBy('votes_count', 'desc')
                ->orderBy('created_at', 'asc');
            }
        ])->where('slug', $slug)->firstOrFail();

        // Incrementar visualizações se o usuário estiver logado
        if (Auth::check()) {
            $existingView = PostView::where('post_id', $post->id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$existingView) {
                PostView::create([
                    'post_id' => $post->id,
                    'user_id' => Auth::id(),
                    'ip_address' => request()->ip(),
                ]);

                $post->increment('views_count');
            }
        } else {
            // Para usuários não logados, usar IP para evitar múltiplas visualizações
            $existingView = PostView::where('post_id', $post->id)
                ->where('ip_address', request()->ip())
                ->whereNull('user_id')
                ->first();

            if (!$existingView) {
                PostView::create([
                    'post_id' => $post->id,
                    'user_id' => null,
                    'ip_address' => request()->ip(),
                ]);

                $post->increment('views_count');
            }
        }

        // Adicionar informações de voto do usuário atual
        $userVote = null;
        if (Auth::check() && $post->votes->isNotEmpty()) {
            $userVote = $post->votes->first()->type;
        }

        // Processar comentários para adicionar informações de voto
        $post->comments->each(function ($comment) {
            $comment->user_vote = null;
            if (Auth::check() && $comment->votes->isNotEmpty()) {
                $comment->user_vote = $comment->votes->first()->type;
            }

            // Processar replies
            if ($comment->replies) {
                $comment->replies->each(function ($reply) {
                    $reply->user_vote = null;
                    if (Auth::check() && $reply->votes->isNotEmpty()) {
                        $reply->user_vote = $reply->votes->first()->type;
                    }
                });
            }
        });

        return Inertia::render('Post/Show', [
            'post' => $post,
            'userVote' => $userVote,
        ]);
    }
}
