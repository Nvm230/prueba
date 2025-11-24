import { useQuery } from '@tanstack/react-query';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import { getAllAchievements, getAchievementStats, AchievementProgress } from '@/services/achievementService';
import { formatDateTime } from '@/utils/formatters';
import { TrophyIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

const ACHIEVEMENT_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: TrophyIcon },
  { id: 'PARTICIPATION', name: 'Participación', icon: CheckCircleIcon },
  { id: 'PROFILE', name: 'Perfil/Comunidad', icon: TrophyIcon },
  { id: 'INTERACTION', name: 'Interacción', icon: TrophyIcon },
  { id: 'CREATIVITY', name: 'Creatividad/Contenido', icon: TrophyIcon },
  { id: 'EXPLORATION', name: 'Exploración', icon: TrophyIcon },
  { id: 'RARE', name: 'Raros/Legendarios', icon: TrophyIcon },
  { id: 'HIDDEN', name: 'Ocultos/Easter Egg', icon: LockClosedIcon }
];

const RARITY_COLORS = {
  COMMON: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  RARE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  EPIC: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  LEGENDARY: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  HIDDEN: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
};

const AchievementsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements', 'all'],
    queryFn: ({ signal }) => getAllAchievements(signal)
  });

  const { data: stats } = useQuery({
    queryKey: ['achievements', 'stats'],
    queryFn: ({ signal }) => getAchievementStats(signal)
  });

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter((a) => a.achievement.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return <LoadingOverlay message="Cargando logros" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Logros' }]} />

      {/* Stats Header */}
      <div className="card bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Logros y Conquistas</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Completa desafíos y desbloquea logros especiales
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              {completionPercentage}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {earnedCount} de {totalCount} logros
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const categoryStats = stats?.byCategory?.[category.id] || 0;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
                {categoryStats > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    isSelected ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  }`}>
                    {categoryStats}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <EmptyState
          title="Sin logros"
          description={`No hay logros en la categoría "${ACHIEVEMENT_CATEGORIES.find(c => c.id === selectedCategory)?.name}".`}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievementProgress) => {
            const { achievement, earned, progress, maxProgress, earnedAt } = achievementProgress;
            const rarity = achievement.rarity || 'COMMON';
            const isLocked = !earned && achievement.rarity === 'HIDDEN';

            return (
              <div
                key={achievement.id}
                className={`rounded-xl border p-5 transition-all ${
                  earned
                    ? 'border-primary-300 dark:border-primary-700 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/20 dark:to-slate-900/70 shadow-md'
                    : isLocked
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60'
                    : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        earned
                          ? RARITY_COLORS[rarity]
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isLocked ? (
                        <LockClosedIcon className="h-6 w-6" />
                      ) : earned ? (
                        <TrophyIcon className="h-6 w-6" />
                      ) : (
                        <TrophyIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${
                        earned
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {isLocked ? '???' : achievement.name}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${
                        RARITY_COLORS[rarity]
                      }`}>
                        {rarity}
                      </span>
                    </div>
                  </div>
                  {earned && (
                    <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  )}
                </div>

                <p className={`text-sm mb-3 ${
                  earned
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {isLocked ? 'Completa desafíos secretos para desbloquear este logro' : achievement.description}
                </p>

                {!earned && progress !== undefined && maxProgress !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progreso</span>
                      <span>{progress} / {maxProgress}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${(progress / maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {earned && earnedAt && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    Desbloqueado: {formatDateTime(earnedAt)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;



