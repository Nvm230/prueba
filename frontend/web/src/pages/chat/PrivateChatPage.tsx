import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PrivateChatWindow from '@/components/chat/PrivateChatWindow';
import { getConversations, getFriends } from '@/services/socialService';
import { useAuth } from '@/hooks/useAuth';
import { UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Avatar from '@/components/display/Avatar';
import { presenceService, PresenceUpdate } from '@/services/presenceService';

const PrivateChatPage = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const disconnectPresence = presenceService.connect((update: PresenceUpdate) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (update.online) {
          next.add(update.userId);
        } else {
          next.delete(update.userId);
        }
        return next;
      });
    });

    return () => {
      disconnectPresence();
    };
  }, []);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: ({ signal }) => getConversations(signal),
    refetchInterval: 10000, // Actualizar cada 10 segundos (reducido para evitar loops)
    staleTime: 0 // Siempre considerar los datos como obsoletos para forzar refresco
  });

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: ({ signal }) => getFriends(signal)
  });

  // Verificar presencia de todos los amigos cuando se cargan
  useEffect(() => {
    if (friends) {
      friends.forEach((friend) => {
        presenceService.checkPresence(friend.id).then((online) => {
          if (online) {
            setOnlineUsers((prev) => new Set(prev).add(friend.id));
          }
        });
      });
    }
  }, [friends]);

  const selectedFriend = friends?.find((f) => f.id === Number(userId));

  if (conversationsLoading || friendsLoading) {
    return <LoadingOverlay message="Cargando conversaciones" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Chat' }]} />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Lista de conversaciones/amigos */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Conversaciones</h2>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {!friends || friends.length === 0 ? (
                <EmptyState
                  title="Sin amigos"
                  description="Agrega amigos para comenzar a chatear."
                  className="py-8"
                />
              ) : (
                friends.map((friend) => {
                  const conversation = conversations?.find((c) => c.userId === friend.id);
                  const isSelected = Number(userId) === friend.id;
                  return (
                    <button
                      key={friend.id}
                      onClick={() => navigate(`/chat/${friend.id}`)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-slate-700 dark:bg-slate-700 border border-slate-600 dark:border-slate-600'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar
                            user={{
                              name: friend.name,
                              profilePictureUrl: friend.profilePictureUrl
                            }}
                            size="sm"
                          />
                          <span
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white dark:border-slate-900 rounded-full ${
                              onlineUsers.has(friend.id) ? 'bg-success-500' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{friend.name}</h3>
                          {conversation && (
                            <p className={`text-xs truncate ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              {conversation.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-xs mr-1">
                                  {conversation.unreadCount}
                                </span>
                              )}
                              Ver conversación
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3">
          {!userId ? (
            <div className="card h-[600px] flex items-center justify-center">
              <div className="text-center">
                <UserCircleIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Elige un amigo de la lista para comenzar a chatear
                </p>
              </div>
            </div>
          ) : !selectedFriend ? (
            <LoadingOverlay message="Cargando conversación" />
          ) : (
            <PrivateChatWindow
              otherUserId={selectedFriend.id}
              otherUserName={selectedFriend.name}
              otherUserProfilePicture={selectedFriend.profilePictureUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChatPage;

