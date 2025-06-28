<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|min:1|max:10000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Se é uma resposta, verificar se o comentário pai pertence ao mesmo post
        if ($request->parent_id) {
            $parentComment = Comment::findOrFail($request->parent_id);
            if ($parentComment->post_id !== $post->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Comentário pai inválido.',
                ], 422);
            }
        }

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'post_id' => $post->id,
            'parent_id' => $request->parent_id,
        ]);

        // Incrementar contador de comentários do post
        $post->increment('comments_count');

        // Carregar relacionamentos para retornar
        $comment->load('user');

        return response()->json([
            'success' => true,
            'comment' => $comment,
            'message' => 'Comentário adicionado com sucesso!',
        ]);
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        // Verificar se o usuário é o dono do comentário
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para editar este comentário.',
            ], 403);
        }

        $request->validate([
            'content' => 'required|string|min:1|max:10000',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'comment' => $comment,
            'message' => 'Comentário atualizado com sucesso!',
        ]);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        // Verificar se o usuário é o dono do comentário
        if ($comment->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para excluir este comentário.',
            ], 403);
        }

        // Marcar como deletado em vez de excluir para manter estrutura
        $comment->update([
            'is_deleted' => true,
            'content' => '[comentário removido]',
        ]);

        // Decrementar contador de comentários do post
        $comment->post->decrement('comments_count');

        return response()->json([
            'success' => true,
            'message' => 'Comentário removido com sucesso!',
        ]);
    }
}
