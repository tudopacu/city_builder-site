/**
 * News article item
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  create_at: string;
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
