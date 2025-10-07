import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  onCategoryClick?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export function Layout({ children, onSearch, onCategoryClick, selectedCategory }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <div className="max-w-[1200px] mx-auto flex gap-6 px-6 py-6">
        <LeftSidebar onCategoryClick={onCategoryClick} selectedCategory={selectedCategory} />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
