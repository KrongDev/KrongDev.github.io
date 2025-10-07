import { useState } from 'react';
import { Layout } from './components/Layout';
import { BlogList } from './components/BlogList';
import { BlogDetail } from './components/BlogDetail';

type Page = 'list' | 'detail';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentPage('detail');
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
    setCurrentPage('list');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'list':
        return (
          <BlogList
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onPostClick={handlePostClick}
          />
        );
      case 'detail':
        return (
          <BlogDetail
            postId={selectedPostId || undefined}
            onBack={handleBackToList}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      onSearch={setSearchQuery}
      onCategoryClick={setSelectedCategory}
      selectedCategory={selectedCategory}
    >
      {renderPage()}
    </Layout>
  );
}
