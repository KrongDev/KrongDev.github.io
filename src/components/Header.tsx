import { Search, FileText, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogoClick = () => {
    navigate('/');
    setSearchQuery('');
    onSearch?.('');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 h-[73px]">
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-16">
          <h1 className="cursor-pointer hover:text-primary transition-colors" onClick={handleLogoClick}>
            Geon Lee
          </h1>
          <nav className="hidden md:flex items-center gap-2" style={{ marginLeft: "10px" }}>
            <Button
              variant={isActive('/') || isActive('') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Blog
            </Button>
            <Button
              variant={isActive('/portfolio') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/portfolio')}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Portfolio
            </Button>
          </nav>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
