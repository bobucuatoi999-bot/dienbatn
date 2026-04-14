import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePosts(language?: string, limit = 10, page = 0) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        let query = supabase
          .from('posts')
          .select('*, post_categories(category:categories(*))')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .range(page * limit, (page + 1) * limit - 1);

        if (language) {
          query = query.eq('language', language);
        }

        const { data, error } = await query;
        if (error) throw error;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [language, limit, page]);

  return { posts, loading, error };
}

export function useTopPosts(limit = 8) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPosts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, slug, thumbnail_url, view_count, language')
          .eq('published', true)
          .order('view_count', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPosts();
  }, [limit]);

  return { posts, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading };
}
