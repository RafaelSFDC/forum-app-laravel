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
    MessageSquare,
    Home,
    TrendingUp,
    Menu,
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
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex h-12 items-center px-2 sm:px-4 max-w-7xl mx-auto">
                {/* Logo e Nome */}
                <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                    <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-1 sm:px-2 py-1 transition-colors">
                        <AppLogoIcon className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 text-[#FF4500]" />
                        <span className="hidden sm:block font-bold text-lg sm:text-xl text-[#FF4500]">Fórum</span>
                    </Link>
                </div>



                {/* Barra de Busca */}
                <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
                    <div className="relative">
                        <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Buscar posts, usuários, tópicos..."
                            value={searchValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-7 sm:pl-10 h-8 sm:h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Ações da Direita */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                    {/* Botões apenas para usuários logados */}
                    {auth.user && (
                        <>
                            {/* Botão Criar Post - Oculto em mobile muito pequeno */}
                            <Button size="sm" className="hidden md:flex items-center space-x-1 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white border-0 rounded-full px-3 lg:px-4 text-sm">
                                <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                                <span className="hidden lg:block">Criar</span>
                            </Button>

                            {/* Botão Criar apenas ícone em mobile */}
                            <Button size="sm" className="md:hidden bg-[#FF4500] hover:bg-[#FF4500]/90 text-white border-0 rounded-full p-2">
                                <Plus className="h-4 w-4" />
                            </Button>

                            {/* Ícones de Notificação - Ocultos em mobile muito pequeno */}
                            <Button variant="ghost" size="icon" className="hidden sm:flex h-7 w-7 lg:h-8 lg:w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hidden sm:flex h-7 w-7 lg:h-8 lg:w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                        </>
                    )}

                    {/* Menu do Usuário */}
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 h-7 sm:h-8 px-1 sm:px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="text-xs bg-[#FF4500] text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block text-xs sm:text-sm font-medium max-w-16 lg:max-w-20 truncate">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown className="hidden sm:block h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500] hover:text-white px-3 text-xs" asChild>
                                <Link href="/login">Entrar</Link>
                            </Button>
                            <Button size="sm" className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full px-2 sm:px-3 text-xs" asChild>
                                <Link href="/register">
                                    <span className="hidden sm:block">Cadastrar</span>
                                    <span className="sm:hidden">+</span>
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Menu Mobile - Mostra navegação em dispositivos pequenos */}
                    <Button variant="ghost" size="icon" className="lg:hidden h-7 w-7 sm:h-8 sm:w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ml-1">
                        <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
