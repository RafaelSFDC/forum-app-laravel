<?php

namespace App\Observers;

use App\Models\Post;
use App\Models\Topic;

class PostObserver
{
    /**
     * Handle the Post "created" event.
     */
    public function created(Post $post): void
    {
        $this->updateTopicPostsCount($post->topic_id);
    }

    /**
     * Handle the Post "updated" event.
     */
    public function updated(Post $post): void
    {
        // Se o tópico mudou, atualizar ambos os contadores
        if ($post->isDirty('topic_id')) {
            $this->updateTopicPostsCount($post->getOriginal('topic_id'));
            $this->updateTopicPostsCount($post->topic_id);
        }
    }

    /**
     * Handle the Post "deleted" event.
     */
    public function deleted(Post $post): void
    {
        $this->updateTopicPostsCount($post->topic_id);
    }

    /**
     * Atualiza o contador de posts de um tópico
     */
    private function updateTopicPostsCount(?int $topicId): void
    {
        if (!$topicId) {
            return;
        }

        $topic = Topic::find($topicId);
        if ($topic) {
            $topic->posts_count = $topic->posts()->published()->count();
            $topic->save();
        }
    }
}
