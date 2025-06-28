<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Vote extends Model
{
    const TYPE_UPVOTE = 1;
    const TYPE_DOWNVOTE = -1;

    protected $fillable = [
        'user_id',
        'votable_id',
        'votable_type',
        'type',
    ];

    protected $casts = [
        'type' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votable(): MorphTo
    {
        return $this->morphTo();
    }

    public function isUpvote(): bool
    {
        return $this->type === self::TYPE_UPVOTE;
    }

    public function isDownvote(): bool
    {
        return $this->type === self::TYPE_DOWNVOTE;
    }
}
