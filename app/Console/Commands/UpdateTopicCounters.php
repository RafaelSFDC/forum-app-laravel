<?php

namespace App\Console\Commands;

use App\Models\Topic;
use Illuminate\Console\Command;

class UpdateTopicCounters extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'topics:update-counters';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza os contadores de posts dos tópicos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Atualizando contadores de posts dos tópicos...');

        $topics = Topic::all();
        $updated = 0;

        foreach ($topics as $topic) {
            $oldCount = $topic->posts_count;
            $newCount = $topic->posts()->published()->count();

            if ($oldCount !== $newCount) {
                $topic->posts_count = $newCount;
                $topic->save();
                $updated++;

                $this->line("Tópico '{$topic->name}': {$oldCount} → {$newCount} posts");
            }
        }

        if ($updated > 0) {
            $this->info("✅ {$updated} tópicos atualizados com sucesso!");
        } else {
            $this->info("✅ Todos os contadores já estão corretos!");
        }

        return 0;
    }
}
