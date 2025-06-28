import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RedditHeader } from '@/components/reddit-header';
import { VoteButtons } from '@/components/vote-buttons';
import { CommentItem } from '@/components/comment-item';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import {
    ArrowLeft,
    MessageSquare,
    Eye,
    Clock,
    ExternalLink,
    Share,
    Bookmark,
    Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Topic {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
}

interface Vote {
    id: number;
    type: number;
    user_id: number;
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

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    type: string;
    url?: string;
    image_url?: string;
    votes_count: number;
    comments_count: number;
    views_count: number;
    is_pinned: boolean;
    created_at: string;
    user: User;
    topic: Topic;
    votes: Vote[];
    comments: Comment[];
}

interface PostShowProps {
    post: Post;
    userVote?: number | null;
    auth: {
        user?: User;
    };
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

export default function PostShow({ post, userVote, auth }: PostShowProps) {
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.user) {
            toast.error('Você precisa estar logado para comentar');
            return;
        }

        if (!newComment.trim()) {
            toast.error('O comentário não pode estar vazio');
            return;
        }

        setIsSubmittingComment(true);

        try {
            const response = await fetch(`/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    content: newComment,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Comentário adicionado com sucesso!');
                setNewComment('');
                // Recarregar a página para mostrar o novo comentário
                router.reload();
            } else {
                toast.error(data.message || 'Erro ao adicionar comentário');
            }
        } catch (error) {
            toast.error('Erro ao adicionar comentário');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <>
            <Head title={post.title} />
            <RedditHeader />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
                    {/* Botão Voltar */}
                    <div className="mb-4">
                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar ao fórum
                            </Link>
                        </Button>
                    </div>

                    {/* Post Principal */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
                        <CardContent className="p-0">
                            <div className="flex">
                                {/* Botões de votação */}
                                <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                                    <VoteButtons
                                        itemId={post.id}
                                        itemType="post"
                                        votesCount={post.votes_count}
                                        userVote={userVote}
                                        isAuthenticated={!!auth.user}
                                    />
                                </div>

                                {/* Conteúdo do post */}
                                <div className="flex-1 min-w-0 p-4 sm:p-6">
                                    {/* Metadados */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-medium rounded-full px-2 py-1"
                                            style={{ backgroundColor: `${post.topic.color}20`, color: post.topic.color }}
                                        >
                                            r/{post.topic.name}
                                        </Badge>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">por u/{post.user.name}</span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</span>
                                        {post.is_pinned && (
                                            <>
                                                <span className="text-sm text-gray-500">•</span>
                                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                                    Fixado
                                                </Badge>
                                            </>
                                        )}
                                    </div>

                                    {/* Título */}
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                                        {post.title}
                                    </h1>

                                    {/* Conteúdo baseado no tipo */}
                                    {post.type === 'text' && post.content && (
                                        <div className="prose prose-sm sm:prose max-w-none dark:prose-invert mb-4">
                                            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                {post.content}
                                            </p>
                                        </div>
                                    )}

                                    {post.type === 'link' && post.url && (
                                        <div className="mb-4">
                                            <a
                                                href={post.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                {post.url}
                                            </a>
                                            {post.content && (
                                                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {post.content}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {post.type === 'image' && post.image_url && (
                                        <div className="mb-4">
                                            <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                                            />
                                            {post.content && (
                                                <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                    {post.content}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Estatísticas e ações */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{post.comments_count} comentários</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{post.views_count} visualizações</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-auto p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                            <Share className="h-4 w-4 mr-1" />
                                            Compartilhar
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-auto p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                            <Bookmark className="h-4 w-4 mr-1" />
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seção de Comentários */}
                    <div className="space-y-4">
                        {/* Formulário para novo comentário */}
                        {auth.user ? (
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4">
                                    <form onSubmit={handleCommentSubmit}>
                                        <div className="mb-3">
                                            <Textarea
                                                placeholder="Adicione um comentário..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="min-h-[100px] resize-none"
                                                disabled={isSubmittingComment}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={!newComment.trim() || isSubmittingComment}
                                                className="bg-[#FF4500] hover:bg-[#FF4500]/90"
                                            >
                                                {isSubmittingComment ? 'Enviando...' : 'Comentar'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardContent className="p-4 text-center">
                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                        Faça login para comentar
                                    </p>
                                    <div className="flex justify-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/login">Entrar</Link>
                                        </Button>
                                        <Button size="sm" className="bg-[#FF4500] hover:bg-[#FF4500]/90" asChild>
                                            <Link href="/register">Cadastrar</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Lista de comentários */}
                        {post.comments.length > 0 ? (
                            <div className="space-y-3">
                                {post.comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        postId={post.id}
                                        isAuthenticated={!!auth.user}
                                        currentUserId={auth.user?.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardContent className="py-8 text-center">
                                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Ainda não há comentários. Seja o primeiro a comentar!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
}
