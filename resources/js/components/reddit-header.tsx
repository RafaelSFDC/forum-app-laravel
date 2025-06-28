import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Bell,
    ChevronDown
} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export function RedditHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    const [searchValue, setSearchValue] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Obter valor de busca atual da URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentSearch = urlParams.get('search') || '';
        setSearchValue(currentSearch);
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);

        // Limpar timeout anterior
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Definir novo timeout para busca
        const newTimeout = setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);

            if (value.trim()) {
                urlParams.set('search', value.trim());
            } else {
                urlParams.delete('search');
            }

            // Manter outros parâmetros (sort, topic)
            const sort = urlParams.get('sort') || 'recent';
            const topic = urlParams.get('topic');

            const params: Record<string, string> = { sort };
            if (value.trim()) params.search = value.trim();
            if (topic) params.topic = topic;

            router.get('/', params, { preserveState: true });
        }, 500); // Debounce de 500ms

        setSearchTimeout(newTimeout);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 flex h-12 items-center justify-between">
                {/* Logo na esquerda */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link href="/" className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-1 transition-colors">
                        <AppLogoIcon className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span className="font-bold text-lg text-primary">Fórum</span>
                    </Link>
                </div>

                {/* Barra de Busca no meio */}
                <div className="flex-1 max-w-2xl mx-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar posts, usuários, tópicos..."
                            value={searchValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 h-9 text-sm bg-muted focus:bg-background focus:border-primary rounded-full"
                        />
                    </div>
                </div>

                {/* Dados do usuário na direita */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Botões apenas para usuários logados */}
                    {auth.user && (
                        <>
                            {/* Botão Criar Post */}
                            <Button size="sm" className="flex items-center space-x-1 rounded-full px-4 text-sm" asChild>
                                <Link href="/posts/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Criar</span>
                                </Link>
                            </Button>

                            {/* Ícone de Notificação */}
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Bell className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {/* Menu do Usuário */}
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 h-8 px-2 rounded-md">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium max-w-20 truncate">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="rounded-full px-4 text-sm" asChild>
                                <Link href="/login">Entrar</Link>
                            </Button>
                            <Button size="sm" className="rounded-full px-4 text-sm" asChild>
                                <Link href="/register">Cadastrar</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
