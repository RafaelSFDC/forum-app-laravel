import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RedditHeader } from '@/components/reddit-header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Type,
    Link as LinkIcon,
    Image as ImageIcon,
    ArrowLeft,
    Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Topic {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    icon: string;
}

interface CreatePostProps {
    topics: Topic[];
}

export default function CreatePost({ topics }: CreatePostProps) {
    const [postType, setPostType] = useState<'text' | 'link' | 'image'>('text');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        type: 'text',
        url: '',
        image_url: '',
        topic_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/posts', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleTypeChange = (type: 'text' | 'link' | 'image') => {
        setPostType(type);
        setData('type', type);
        // Limpar campos específicos quando mudar o tipo
        if (type !== 'link') setData('url', '');
        if (type !== 'image') setData('image_url', '');
        if (type !== 'text') setData('content', '');
    };

    return (
        <>
            <Head title="Criar Post" />
            <RedditHeader />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Header da página */}
                    <div className="flex items-center space-x-4 mb-6">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/" className="flex items-center space-x-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span>Voltar</span>
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Post</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Novo Post</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Seleção do Tópico */}
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Tópico *</Label>
                                    <Select value={data.topic_id} onValueChange={(value) => setData('topic_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um tópico" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topics.map((topic) => (
                                                <SelectItem key={topic.id} value={topic.id.toString()}>
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: topic.color }}
                                                        />
                                                        <span>{topic.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.topic_id && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.topic_id}</p>
                                    )}
                                </div>

                                {/* Título */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Digite o título do seu post..."
                                        className="w-full"
                                        maxLength={255}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                    )}
                                </div>

                                {/* Tipo de Post */}
                                <div className="space-y-3">
                                    <Label>Tipo de Post</Label>
                                    <Tabs value={postType} onValueChange={(value) => handleTypeChange(value as any)}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="text" className="flex items-center space-x-2">
                                                <Type className="h-4 w-4" />
                                                <span>Texto</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="link" className="flex items-center space-x-2">
                                                <LinkIcon className="h-4 w-4" />
                                                <span>Link</span>
                                            </TabsTrigger>
                                            <TabsTrigger value="image" className="flex items-center space-x-2">
                                                <ImageIcon className="h-4 w-4" />
                                                <span>Imagem</span>
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="text" className="space-y-2">
                                            <Label htmlFor="content">Conteúdo *</Label>
                                            <Textarea
                                                id="content"
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                placeholder="Escreva o conteúdo do seu post..."
                                                className="min-h-32"
                                                maxLength={10000}
                                            />
                                            {errors.content && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="link" className="space-y-2">
                                            <Label htmlFor="url">URL *</Label>
                                            <Input
                                                id="url"
                                                type="url"
                                                value={data.url}
                                                onChange={(e) => setData('url', e.target.value)}
                                                placeholder="https://exemplo.com"
                                                maxLength={500}
                                            />
                                            {errors.url && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.url}</p>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="image" className="space-y-2">
                                            <Label htmlFor="image_url">URL da Imagem *</Label>
                                            <Input
                                                id="image_url"
                                                type="url"
                                                value={data.image_url}
                                                onChange={(e) => setData('image_url', e.target.value)}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                maxLength={500}
                                            />
                                            {errors.image_url && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.image_url}</p>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        * Campos obrigatórios
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Button type="button" variant="outline" asChild>
                                            <Link href="/">Cancelar</Link>
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
                                        >
                                            {processing ? (
                                                <span>Publicando...</span>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Publicar Post
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}
