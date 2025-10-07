import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '../data/posts';
import type { Category } from '../types/post';

interface LeftSidebarProps {
  onCategoryClick?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

export function LeftSidebar({ onCategoryClick, selectedCategory }: LeftSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
        
        // 기본으로 첫 번째 카테고리 확장
        if (cats.length > 0 && cats[0].subcategories) {
          setExpandedCategories([cats[0].id]);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick?.(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <aside className="w-64 flex-shrink-0 sticky top-[97px] self-start">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center p-6 pb-6 border-b border-border">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3>John Doe</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Frontend Developer & UI Designer
          </p>
        </div>

        {/* Categories */}
        <div className="p-6 max-h-[calc(100vh-97px-280px)] overflow-y-auto">
          <h4 className="mb-3">Categories</h4>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No categories yet. Add posts to create categories!
            </p>
          ) : (
            <nav className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => {
                      if (category.subcategories) {
                        toggleCategory(category.id);
                      }
                      handleCategoryClick(category.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm ${
                      selectedCategory === category.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {category.count}
                      </span>
                      {category.subcategories && category.subcategories.length > 0 && (
                        expandedCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </button>
                  {category.subcategories && 
                   category.subcategories.length > 0 && 
                   expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategoryClick(sub.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm ${
                            selectedCategory === sub.id ? 'bg-accent' : ''
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {sub.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
}
