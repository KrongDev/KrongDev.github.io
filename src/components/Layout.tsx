import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  onCategoryClick?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
  showSidebar?: boolean;
}

export function Layout({ children, onSearch, onCategoryClick, selectedCategory, showSidebar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <div className={`mx-auto flex gap-6 px-6 py-6 ${showSidebar ? 'max-w-[1200px]' : 'max-w-[1400px]'}`}>
        {showSidebar && (
          <LeftSidebar onCategoryClick={onCategoryClick} selectedCategory={selectedCategory} />
        )}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
