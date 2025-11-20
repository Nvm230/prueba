import { ReactionSummary } from '@/types/reaction';

interface MessageReactionsProps {
  reactions?: ReactionSummary[];
  currentUserId?: number;
  onReact: (emoji: string) => void;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions = [], currentUserId, onReact }) => {
  if (!reactions.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {reactions.map((reaction) => {
        const count = reaction.userIds.length;
        const reacted = currentUserId ? reaction.userIds.includes(currentUserId) : false;
        return (
          <button
            key={reaction.emoji}
            type="button"
            onClick={() => onReact(reaction.emoji)}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
              reacted
                ? 'border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-600/70 dark:bg-primary-900/20 dark:text-primary-200'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            <span>{reaction.emoji}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MessageReactions;






















