import type { NewsItem as NewsItemType } from '../types/news';
import { CDN_BASE_URL } from '../config/config';

/**
 * NewsItem Component Props
 */
interface NewsItemProps {
  item: NewsItemType;
}

/**
 * NewsItem Component
 * Displays a single news article with image on left and text on right
 */
export function NewsItem({ item }: NewsItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || /^https?:\/\//i.test(imageUrl) || !CDN_BASE_URL) {
      return imageUrl;
    }

    const normalizedBaseUrl = CDN_BASE_URL.replace(/\/+$/, '');
    const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

    return `${normalizedBaseUrl}${normalizedImageUrl}`;
  };

  return (
    <div className="news-item">
      <div className="news-item-image">
        <img src={getImageUrl(item.imageUrl)} alt={item.title} />
      </div>
      <div className="news-item-content">
        <h3 className="news-item-title">{item.title}</h3>
        <p className="news-item-date">{formatDate(item.create_at)}</p>
        <p className="news-item-text">{item.content}</p>
      </div>
    </div>
  );
}
