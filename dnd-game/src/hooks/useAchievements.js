import { useState, useCallback } from 'react';
import { AchievementService } from '../services/achievementService';
export function useAchievements() {
  const [notification, setNotification] = useState(null);
  const unlock = useCallback((id, title) => {
    const isNew = AchievementService.unlock(id);
    if (isNew) {
      setNotification({ id, title });
      setTimeout(() => setNotification(null), 4000);
    }
  }, []);
  return { notification, unlock };
}
