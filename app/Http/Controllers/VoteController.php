<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class VoteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function votePost(Request $request, Post $post): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:1,-1', // 1 = upvote, -1 = downvote
        ]);

        $type = (int) $request->type;
        $userId = Auth::id();

        // Verificar se já existe um voto do usuário para este post
        $existingVote = Vote::where('user_id', $userId)
            ->where('votable_id', $post->id)
            ->where('votable_type', Post::class)
            ->first();

        if ($existingVote) {
            if ($existingVote->type === $type) {
                // Se é o mesmo tipo de voto, remover (toggle)
                $existingVote->delete();
                $this->updatePostVoteCount($post);
                
                return response()->json([
                    'success' => true,
                    'action' => 'removed',
                    'votes_count' => $post->fresh()->votes_count,
                    'user_vote' => null,
                ]);
            } else {
                // Se é tipo diferente, atualizar
                $existingVote->update(['type' => $type]);
                $this->updatePostVoteCount($post);
                
                return response()->json([
                    'success' => true,
                    'action' => 'updated',
                    'votes_count' => $post->fresh()->votes_count,
                    'user_vote' => $type,
                ]);
            }
        } else {
            // Criar novo voto
            Vote::create([
                'user_id' => $userId,
                'votable_id' => $post->id,
                'votable_type' => Post::class,
                'type' => $type,
            ]);
            
            $this->updatePostVoteCount($post);
            
            return response()->json([
                'success' => true,
                'action' => 'created',
                'votes_count' => $post->fresh()->votes_count,
                'user_vote' => $type,
            ]);
        }
    }

    public function voteComment(Request $request, Comment $comment): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:1,-1', // 1 = upvote, -1 = downvote
        ]);

        $type = (int) $request->type;
        $userId = Auth::id();

        // Verificar se já existe um voto do usuário para este comentário
        $existingVote = Vote::where('user_id', $userId)
            ->where('votable_id', $comment->id)
            ->where('votable_type', Comment::class)
            ->first();

        if ($existingVote) {
            if ($existingVote->type === $type) {
                // Se é o mesmo tipo de voto, remover (toggle)
                $existingVote->delete();
                $this->updateCommentVoteCount($comment);
                
                return response()->json([
                    'success' => true,
                    'action' => 'removed',
                    'votes_count' => $comment->fresh()->votes_count,
                    'user_vote' => null,
                ]);
            } else {
                // Se é tipo diferente, atualizar
                $existingVote->update(['type' => $type]);
                $this->updateCommentVoteCount($comment);
                
                return response()->json([
                    'success' => true,
                    'action' => 'updated',
                    'votes_count' => $comment->fresh()->votes_count,
                    'user_vote' => $type,
                ]);
            }
        } else {
            // Criar novo voto
            Vote::create([
                'user_id' => $userId,
                'votable_id' => $comment->id,
                'votable_type' => Comment::class,
                'type' => $type,
            ]);
            
            $this->updateCommentVoteCount($comment);
            
            return response()->json([
                'success' => true,
                'action' => 'created',
                'votes_count' => $comment->fresh()->votes_count,
                'user_vote' => $type,
            ]);
        }
    }

    private function updatePostVoteCount(Post $post): void
    {
        $votesSum = Vote::where('votable_id', $post->id)
            ->where('votable_type', Post::class)
            ->sum('type');
            
        $post->update(['votes_count' => $votesSum]);
    }

    private function updateCommentVoteCount(Comment $comment): void
    {
        $votesSum = Vote::where('votable_id', $comment->id)
            ->where('votable_type', Comment::class)
            ->sum('type');
            
        $comment->update(['votes_count' => $votesSum]);
    }
}
