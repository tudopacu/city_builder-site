import { useState, useEffect } from 'react';
import { newsApi } from '../modules/newsApi';
import { NewsItem } from './NewsItem';
import { Pagination } from './Pagination';
import type { NewsItem as NewsItemType } from '../types/news';

/**
 * NewsFeed Component
 * Displays news articles with pagination
 */
export function NewsFeed() {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      const response = await newsApi.getNews(currentPage, pageSize);

      if (response.success) {
        setNews(response.news);
        setTotalPages(Math.ceil(response.total / pageSize));
      } else {
        setError(response.message || 'Failed to load news');
        setNews([]);
      }

      setLoading(false);
    };

    fetchNews();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="news-feed">
        <p className="loading-message">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-feed">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="news-feed">
        <p className="info-text">No news articles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="news-list">
        {news.map((item, index) => (
          <NewsItem key={item.id} item={item} isNewest={index === 0 && currentPage === 1} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
