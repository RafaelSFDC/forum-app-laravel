import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoteButtonsProps {
    itemId: number;
    itemType: 'post' | 'comment';
    votesCount: number;
    userVote?: number | null;
    isAuthenticated: boolean;
    size?: 'sm' | 'md';
}

export function VoteButtons({
    itemId,
    itemType,
    votesCount,
    userVote,
    isAuthenticated,
    size = 'md'
}: VoteButtonsProps) {
    const [currentVote, setCurrentVote] = useState<number | null>(userVote || null);
    const [currentCount, setCurrentCount] = useState(votesCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async (voteType: 1 | -1) => {
        if (!isAuthenticated) {
            toast.error('Você precisa estar logado para votar');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);

        try {
            const endpoint = itemType === 'post'
                ? `/posts/${itemId}/vote`
                : `/comments/${itemId}/vote`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    type: voteType,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCurrentVote(data.user_vote);
                setCurrentCount(data.votes_count);

                // Feedback visual baseado na ação
                if (data.action === 'created') {
                    toast.success(voteType === 1 ? 'Upvote adicionado!' : 'Downvote adicionado!');
                } else if (data.action === 'updated') {
                    toast.success(voteType === 1 ? 'Mudou para upvote!' : 'Mudou para downvote!');
                } else if (data.action === 'removed') {
                    toast.success('Voto removido!');
                }
            } else {
                toast.error(data.message || 'Erro ao votar');
            }
        } catch (error) {
            toast.error('Erro ao votar');
            console.error('Vote error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <div className="flex flex-col items-center space-y-1">
            {/* Upvote */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    buttonSize,
                    'hover:bg-primary/10 transition-colors',
                    currentVote === 1 && 'bg-primary/10 text-primary',
                    isLoading && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleVote(1)}
                disabled={isLoading}
            >
                <ArrowUp className={cn(
                    iconSize,
                    currentVote === 1 && 'fill-current'
                )} />
            </Button>

            {/* Contador de votos */}
            <span className={cn(
                'font-bold min-w-[2rem] text-center',
                textSize,
                currentVote === 1 && 'text-primary',
                currentVote === -1 && 'text-accent',
                currentVote === null && 'text-foreground'
            )}>
                {currentCount}
            </span>

            {/* Downvote */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    buttonSize,
                    'hover:bg-accent/10 transition-colors',
                    currentVote === -1 && 'bg-accent/10 text-accent',
                    isLoading && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleVote(-1)}
                disabled={isLoading}
            >
                <ArrowDown className={cn(
                    iconSize,
                    currentVote === -1 && 'fill-current'
                )} />
            </Button>
        </div>
    );
}
