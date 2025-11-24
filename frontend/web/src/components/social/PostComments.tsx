import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment, deleteComment, Comment } from '@/services/postService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import Avatar from '@/components/display/Avatar';
import { formatDateTime } from '@/utils/formatters';
import { TrashIcon } from '@heroicons/react/24/outline';

interface PostCommentsProps {
  postId: number;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: ({ signal }) => getComments(postId, { size: 50 }, signal)
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(postId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setCommentText('');
      pushToast({ type: 'success', title: 'Comentario publicado', description: 'Tu comentario ha sido publicado.' });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo publicar el comentario.' });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      pushToast({ type: 'success', title: 'Comentario eliminado', description: 'El comentario ha sido eliminado.' });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo eliminar el comentario.' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    createCommentMutation.mutate(commentText);
  };

  const comments = commentsData?.content || [];

  return (
    <div className="mt-4 pt-4 px-4 pb-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
      {/* Formulario de comentario */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar user={user} size="sm" />
          <div className="flex-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..."
              className="input-field w-full"
              disabled={createCommentMutation.isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!commentText.trim() || createCommentMutation.isLoading}
            className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3 pl-0">
        {isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No hay comentarios aún.</p>
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="flex items-start gap-3 px-1">
              <Avatar user={comment.user} size="sm" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  {user && user.id === comment.user.id && (
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar este comentario?')) {
                          deleteCommentMutation.mutate(comment.id);
                        }
                      }}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-error-500"
                      title="Eliminar comentario"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostComments;



