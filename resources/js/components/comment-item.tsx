import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { VoteButtons } from '@/components/vote-buttons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    MessageSquare,
    Edit,
    Trash2,
    MoreHorizontal,
    Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Comment {
    id: number;
    content: string;
    votes_count: number;
    depth: number;
    is_deleted: boolean;
    created_at: string;
    user: User;
    user_vote?: number | null;
    replies?: Comment[];
}

interface CommentItemProps {
    comment: Comment;
    postId: number;
    isAuthenticated: boolean;
    currentUserId?: number;
    depth?: number;
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}m`;
    return `${Math.floor(diffInSeconds / 31536000)}a`;
}

export function CommentItem({
    comment,
    postId,
    isAuthenticated,
    currentUserId,
    depth = 0
}: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const getInitials = useInitials();

    const isOwner = currentUserId === comment.user.id;
    const maxDepth = 5; // Máximo de níveis de aninhamento

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Você precisa estar logado para responder');
            return;
        }

        if (!replyContent.trim()) {
            toast.error('A resposta não pode estar vazia');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    content: replyContent,
                    parent_id: comment.id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Resposta adicionada com sucesso!');
                setReplyContent('');
                setIsReplying(false);
                router.reload();
            } else {
                toast.error(data.message || 'Erro ao adicionar resposta');
            }
        } catch (error) {
            toast.error('Erro ao adicionar resposta');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editContent.trim()) {
            toast.error('O comentário não pode estar vazio');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/comments/${comment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    content: editContent,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Comentário atualizado com sucesso!');
                setIsEditing(false);
                router.reload();
            } else {
                toast.error(data.message || 'Erro ao atualizar comentário');
            }
        } catch (error) {
            toast.error('Erro ao atualizar comentário');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) {
            return;
        }

        try {
            const response = await fetch(`/comments/${comment.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Comentário removido com sucesso!');
                router.reload();
            } else {
                toast.error(data.message || 'Erro ao remover comentário');
            }
        } catch (error) {
            toast.error('Erro ao remover comentário');
        }
    };

    // Calcular margem baseada na profundidade
    const marginLeft = Math.min(depth * 20, maxDepth * 20);

    return (
        <div style={{ marginLeft: `${marginLeft}px` }}>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                    <div className="flex">
                        {/* Botões de votação */}
                        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                            <VoteButtons
                                itemId={comment.id}
                                itemType="comment"
                                votesCount={comment.votes_count}
                                userVote={comment.user_vote}
                                isAuthenticated={isAuthenticated}
                                size="sm"
                            />
                        </div>

                        {/* Conteúdo do comentário */}
                        <div className="flex-1 min-w-0 p-3">
                            {/* Cabeçalho do comentário */}
                            <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-5 w-5">
                                    <AvatarFallback className="text-xs bg-[#FF4500] text-white">
                                        {getInitials(comment.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    u/{comment.user.name}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                    {formatTimeAgo(comment.created_at)}
                                </span>
                                {comment.is_deleted && (
                                    <>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-red-500">removido</span>
                                    </>
                                )}
                            </div>

                            {/* Conteúdo */}
                            {isEditing ? (
                                <form onSubmit={handleEdit} className="mb-3">
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="min-h-[80px] resize-none mb-2"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={!editContent.trim() || isSubmitting}
                                            className="bg-[#FF4500] hover:bg-[#FF4500]/90"
                                        >
                                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditContent(comment.content);
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            )}

                            {/* Ações do comentário */}
                            {!comment.is_deleted && (
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    {isAuthenticated && depth < maxDepth && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            onClick={() => setIsReplying(!isReplying)}
                                        >
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            Responder
                                        </Button>
                                    )}

                                    {isOwner && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                <Edit className="h-3 w-3 mr-1" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1 text-gray-500 hover:text-red-600"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Excluir
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <Flag className="h-3 w-3 mr-1" />
                                        Reportar
                                    </Button>
                                </div>
                            )}

                            {/* Formulário de resposta */}
                            {isReplying && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                    <form onSubmit={handleReply}>
                                        <Textarea
                                            placeholder="Escreva sua resposta..."
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="min-h-[80px] resize-none mb-2"
                                            disabled={isSubmitting}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!replyContent.trim() || isSubmitting}
                                                className="bg-[#FF4500] hover:bg-[#FF4500]/90"
                                            >
                                                {isSubmitting ? 'Enviando...' : 'Responder'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setIsReplying(false);
                                                    setReplyContent('');
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Renderizar respostas */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            isAuthenticated={isAuthenticated}
                            currentUserId={currentUserId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
