import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RedditHeader } from '@/components/reddit-header';
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
                {/* Reddit-style Header */}
                <RedditHeader />

                {/* Sub-header com filtros */}
                <div className="border-b bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fórum</h1>
                                <div className="flex items-center space-x-3">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-500">Ordenar por:</span>
                                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                        {[
                                            { key: 'recent', label: 'Recente' },
                                            { key: 'popular', label: 'Popular' },
                                            { key: 'top', label: 'Top' }
                                        ].map((sort) => (
                                            <Button
                                                key={sort.key}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSortChange(sort.key)}
                                                className={cn(
                                                    "flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                                    selectedSort === sort.key
                                                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                )}
                                            >
                                                {getSortIcon(sort.key)}
                                                <span>{sort.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar com tópicos */}
                        <div className="lg:col-span-1">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                                <CardHeader className="pb-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Tópicos</h3>
                                </CardHeader>
                                <CardContent className="space-y-1 pt-0">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            !currentTopic
                                                ? "bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                        onClick={() => handleTopicFilter()}
                                    >
                                        Todos os tópicos
                                    </Button>
                                    <Separator className="my-2" />
                                    {topics.map((topic) => (
                                        <Button
                                            key={topic.id}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                currentTopic === topic.slug
                                                    ? "bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            )}
                                            onClick={() => handleTopicFilter(topic.slug)}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                                                style={{ backgroundColor: topic.color }}
                                            />
                                            <span className="truncate flex-1 text-left">{topic.name}</span>
                                            <Badge variant="secondary" className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                {topic.posts_count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Lista de posts */}
                        <div className="lg:col-span-3 space-y-3">
                            {posts.data.length === 0 ? (
                                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardContent className="py-12 text-center">
                                        <p className="text-gray-500 dark:text-gray-400">Nenhum post encontrado.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                posts.data.map((post) => (
                                    <Card key={post.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
                                        <CardContent className="p-0">
                                            <div className="flex">
                                                {/* Botões de votação */}
                                                <div className="flex flex-col items-center space-y-1 bg-gray-50 dark:bg-gray-700 p-2 rounded-l-lg">
                                                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                                                        <ArrowUp className="h-3 w-3" />
                                                    </Button>
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        post.votes_count > 0 ? "text-[#FF4500]" :
                                                        post.votes_count < 0 ? "text-blue-600" : "text-gray-500"
                                                    )}>
                                                        {post.votes_count}
                                                    </span>
                                                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                                                        <ArrowDown className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                {/* Conteúdo do post */}
                                                <div className="flex-1 min-w-0 p-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-medium rounded-full px-2 py-1"
                                                            style={{ backgroundColor: `${post.topic.color}20`, color: post.topic.color }}
                                                        >
                                                            r/{post.topic.name}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-gray-500">por u/{post.user.name}</span>
                                                        <span className="text-xs text-gray-500">•</span>
                                                        <span className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</span>
                                                        {post.is_pinned && (
                                                            <>
                                                                <span className="text-xs text-gray-500">•</span>
                                                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">Fixado</Badge>
                                                            </>
                                                        )}
                                                    </div>

                                                    <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-white hover:text-[#FF4500] cursor-pointer transition-colors">
                                                        <Link href={`/posts/${post.slug}`}>
                                                            {post.title}
                                                        </Link>
                                                    </h3>

                                                    {post.content && (
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                                            {post.content}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                        <div className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer transition-colors">
                                                            <MessageSquare className="h-3 w-3" />
                                                            <span>{post.comments_count} comentários</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer transition-colors">
                                                            <Eye className="h-3 w-3" />
                                                            <span>{post.views_count} visualizações</span>
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
