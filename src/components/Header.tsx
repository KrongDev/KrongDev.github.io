import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const navigate = useNavigate();
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

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 h-[73px]">
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="cursor-pointer hover:text-primary transition-colors" onClick={handleLogoClick}>
            Geon Lee
          </h1>
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
