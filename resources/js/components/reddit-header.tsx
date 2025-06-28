import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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
import RedditLogo from './reddit-logo';

export function RedditHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex h-12 items-center px-4 max-w-7xl mx-auto">
                {/* Logo e Nome */}
                <div className="flex items-center space-x-2 min-w-0">
                    <Link href="/" className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1 transition-colors">
                        <RedditLogo className="h-8 w-8 flex-shrink-0" />
                        <span className="hidden font-bold text-xl sm:block text-[#FF4500]">reddit</span>
                    </Link>
                </div>

                {/* Navegação Principal */}
                <div className="hidden md:flex items-center space-x-1 ml-6">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <TrendingUp className="h-4 w-4" />
                        <span>Popular</span>
                    </Button>
                </div>

                {/* Barra de Busca */}
                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Buscar no Reddit"
                            className="w-full pl-10 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Ações da Direita */}
                <div className="flex items-center space-x-1">
                    {/* Botão Criar Post */}
                    <Button size="sm" className="hidden sm:flex items-center space-x-1 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white border-0 rounded-full px-4">
                        <Plus className="h-4 w-4" />
                        <span>Criar</span>
                    </Button>

                    {/* Ícones de Notificação */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <Bell className="h-4 w-4" />
                    </Button>

                    {/* Menu do Usuário */}
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="text-xs bg-[#FF4500] text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
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
                            <Button variant="outline" size="sm" className="rounded-full border-[#FF4500] text-[#FF4500] hover:bg-[#FF4500] hover:text-white" asChild>
                                <Link href="/login">Entrar</Link>
                            </Button>
                            <Button size="sm" className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full" asChild>
                                <Link href="/register">Cadastrar</Link>
                            </Button>
                        </div>
                    )}

                    {/* Menu Mobile */}
                    <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
