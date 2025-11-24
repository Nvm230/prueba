const REACTION_EMOJIS = ['👍', '❤️', '😂', '🎉', '😮', '😢'];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg px-3 py-2 flex gap-2">
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            onSelect(emoji);
            onClose?.();
          }}
          className="text-lg hover:scale-110 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
export { REACTION_EMOJIS };






















