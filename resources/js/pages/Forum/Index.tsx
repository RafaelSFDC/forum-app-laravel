import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowUp,
    ArrowDown,
    MessageSquare,
    Eye,
    Clock,
    TrendingUp,
    Trophy,
    Filter,
    Plus
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
    posts_count: number;
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
}

interface ForumIndexProps {
    posts: {
        data: Post[];
        links: any[];
        meta: any;
    };
    topics: Topic[];
    currentSort: string;
    currentTopic?: string;
}

export default function ForumIndex({ posts, topics, currentSort, currentTopic }: ForumIndexProps) {
    const [selectedSort, setSelectedSort] = useState(currentSort);

    const handleSortChange = (sort: string) => {
        setSelectedSort(sort);
        router.get('/', { sort, topic: currentTopic }, { preserveState: true });
    };

    const handleTopicFilter = (topicSlug?: string) => {
        router.get('/', { sort: selectedSort, topic: topicSlug }, { preserveState: true });
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'agora';
        if (diffInHours < 24) return `${diffInHours}h atrás`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d atrás`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}sem atrás`;
    };

    const getSortIcon = (sort: string) => {
        switch (sort) {
            case 'popular': return <TrendingUp className="h-4 w-4" />;
            case 'top': return <Trophy className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <>
            <Head title="Fórum" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-card">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold">Fórum</h1>
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Ordenar por:</span>
                                    <div className="flex space-x-1">
                                        {[
                                            { key: 'recent', label: 'Recente' },
                                            { key: 'popular', label: 'Popular' },
                                            { key: 'top', label: 'Top' }
                                        ].map((sort) => (
                                            <Button
                                                key={sort.key}
                                                variant={selectedSort === sort.key ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => handleSortChange(sort.key)}
                                                className="flex items-center space-x-1"
                                            >
                                                {getSortIcon(sort.key)}
                                                <span>{sort.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button className="flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Criar Post</span>
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar com tópicos */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <h3 className="font-semibold">Tópicos</h3>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant={!currentTopic ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        onClick={() => handleTopicFilter()}
                                    >
                                        Todos os tópicos
                                    </Button>
                                    <Separator />
                                    {topics.map((topic) => (
                                        <Button
                                            key={topic.id}
                                            variant={currentTopic === topic.slug ? 'default' : 'ghost'}
                                            className="w-full justify-start"
                                            onClick={() => handleTopicFilter(topic.slug)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: topic.color }}
                                            />
                                            <span className="truncate">{topic.name}</span>
                                            <Badge variant="secondary" className="ml-auto">
                                                {topic.posts_count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Lista de posts */}
                        <div className="lg:col-span-3 space-y-4">
                            {posts.data.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <p className="text-muted-foreground">Nenhum post encontrado.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                posts.data.map((post) => (
                                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex space-x-4">
                                                {/* Botões de votação */}
                                                <div className="flex flex-col items-center space-y-1 min-w-[40px]">
                                                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        post.votes_count > 0 ? "text-green-600" :
                                                        post.votes_count < 0 ? "text-red-600" : "text-muted-foreground"
                                                    )}>
                                                        {post.votes_count}
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Conteúdo do post */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Badge
                                                            variant="secondary"
                                                            style={{ backgroundColor: `${post.topic.color}20`, color: post.topic.color }}
                                                        >
                                                            {post.topic.name}
                                                        </Badge>
                                                        {post.is_pinned && (
                                                            <Badge variant="outline">Fixado</Badge>
                                                        )}
                                                    </div>

                                                    <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
                                                        <Link href={`/posts/${post.slug}`}>
                                                            {post.title}
                                                        </Link>
                                                    </h3>

                                                    {post.content && (
                                                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                            {post.content}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                        <span>por {post.user.name}</span>
                                                        <span>{formatTimeAgo(post.created_at)}</span>
                                                        <div className="flex items-center space-x-1">
                                                            <MessageSquare className="h-4 w-4" />
                                                            <span>{post.comments_count}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Eye className="h-4 w-4" />
                                                            <span>{post.views_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
