import { useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';
import { siteSettingsService } from '../lib/supabase';
import { INITIAL_SITE_SETTINGS } from '../data/mockProducts';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await siteSettingsService.get();
      setSettings(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    const updated = await siteSettingsService.update(updates);
    setSettings(updated);
    return updated;
  };

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    updateSettings,
  };
}

