import type { NewsResponse } from '../types/news';
import { API_BASE_URL } from '../config/config';

/**
 * News API Module
 * Handles all news-related API calls
 */
export const newsApi = {
  /**
   * Fetch news articles with pagination
   */
  async getNews(page: number = 1, pageSize: number = 5): Promise<NewsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/news?page=${page}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          news: [],
          total: 0,
          page,
          pageSize,
          message: result.error || 'Failed to fetch news',
        };
      }

      return {
        success: true,
        news: result.news || [],
        total: result.total || 0,
        page: result.page || page,
        pageSize: result.pageSize || pageSize,
      };
    } catch (error) {
      return {
        success: false,
        news: [],
        total: 0,
        page,
        pageSize,
        message: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },
};
