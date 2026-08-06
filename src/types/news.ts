/**
 * News article item
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
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
