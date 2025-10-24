import { Search, FileText, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // URL 파라미터와 검색어 동기화
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    setSearchQuery(urlSearchQuery);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogoClick = () => {
    // 검색 상태를 유지하면서 홈으로 이동
    const currentParams = new URLSearchParams(searchParams);
    const queryString = currentParams.toString();
    const homeUrl = queryString ? `/?${queryString}` : '/';
    navigate(homeUrl);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 h-[73px]">
      <div className="px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-16">
          <h1 className="cursor-pointer hover:text-primary transition-colors" onClick={handleLogoClick}>
            Geon Lee
          </h1>
          <nav className="hidden md:flex items-center gap-2" style={{ marginLeft: "10px" }}>
            <Button
              variant={isActive('/') || isActive('') ? 'default' : 'ghost'}
              size="sm"
              onClick={handleLogoClick}
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
