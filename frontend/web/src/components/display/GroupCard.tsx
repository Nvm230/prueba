import { Group } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const GroupCard: React.FC<{ group: Group; onJoin?: (groupId: number) => void }> = ({ group, onJoin }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const members = group.members ?? [];
  const isPrivate = group.privacy === 'PRIVATE';
  const isMember = user ? members.some((m) => m.id === user.id) : false;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/groups/${group.id}`)}>
        <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{group.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Owner: {group.owner.name}</p>
        </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
              {members.length} miembros
            </span>
            <span
              className={`text-[11px] uppercase tracking-wide ${
                isPrivate ? 'text-rose-500' : 'text-emerald-500'
              }`}
            >
              {isPrivate ? 'Privado' : 'Público'}
            </span>
          </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
        {members.slice(0, 4).map((member) => (
          <span key={member.id} className="rounded-full bg-primary-50 dark:bg-primary-600/10 px-2 py-1">
            {member.name}
          </span>
        ))}
        {members.length > 4 && <span>+{members.length - 4} more</span>}
      </div>
      {!isMember && onJoin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onJoin(group.id);
          }}
          className="self-start rounded-full bg-primary-600 hover:bg-primary-500 text-white px-4 py-1 text-sm transition"
        >
          {isPrivate ? 'Solicitar acceso' : 'Unirse al grupo'}
        </button>
      )}
      {isMember && (
        <span className="self-start text-xs text-slate-500 dark:text-slate-400">Miembro</span>
      )}
    </div>
  );
};

export default GroupCard;
