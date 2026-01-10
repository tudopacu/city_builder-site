/**
 * News article item
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

/**
 * News API response
 */
export interface NewsResponse {
  success: boolean;
  news: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  message?: string;
}
