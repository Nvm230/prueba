import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import Avatar from '@/components/display/Avatar';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import {
  getFriends,
  getFriendRequests,
  getFriendRecommendations,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsers,
  scanQr
} from '@/services/socialService';
import {
  UserPlusIcon,
  CheckIcon,
  XMarkIcon,
  QrCodeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const FriendsPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'recommendations' | 'search'>('friends');
  const [searchEmail, setSearchEmail] = useState('');
  const [qrData, setQrData] = useState('');

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: ({ signal }) => getFriends(signal),
    enabled: activeTab === 'friends'
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: ({ signal }) => getFriendRequests(signal),
    enabled: activeTab === 'requests'
  });

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['friendRecommendations'],
    queryFn: ({ signal }) => getFriendRecommendations(signal),
    enabled: activeTab === 'recommendations'
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['userSearch', searchEmail],
    queryFn: ({ signal }) => searchUsers(searchEmail, signal),
    enabled: activeTab === 'search' && searchEmail.length >= 3
  });

  const sendRequestMutation = useMutation({
    mutationFn: (receiverId: number) => sendFriendRequest(receiverId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Solicitud enviada', description: 'La solicitud de amistad fue enviada.' });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friendRecommendations'] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo enviar la solicitud' });
    }
  });

  const acceptMutation = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Solicitud aceptada', description: 'Ahora son amigos.' });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo aceptar la solicitud' });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: number) => rejectFriendRequest(requestId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Solicitud rechazada', description: 'La solicitud fue rechazada.' });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo rechazar la solicitud' });
    }
  });

  const scanQrMutation = useMutation({
    mutationFn: (qrData: string) => scanQr(qrData),
    onSuccess: (data) => {
      sendRequestMutation.mutate(data.id);
      setQrData('');
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'QR inválido' });
    }
  });

  const handleScanQr = () => {
    if (!qrData.trim()) {
      pushToast({ type: 'error', title: 'Error', description: 'Ingresa el código QR' });
      return;
    }
    scanQrMutation.mutate(qrData);
  };

  const tabs = [
    { id: 'friends', name: 'Amigos', count: friends?.length || 0 },
    { id: 'requests', name: 'Solicitudes', count: requests?.length || 0 },
    { id: 'recommendations', name: 'Recomendaciones', count: recommendations?.length || 0 },
    { id: 'search', name: 'Buscar' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Amigos' }]} />

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <UserPlusIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Amigos</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gestiona tus conexiones y encuentra nuevos amigos</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <nav className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Agregar por QR */}
        {activeTab === 'search' && (
          <div className="mb-6 p-4 rounded-lg bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5 text-warning-400" />
              <span className="text-white">Agregar por código QR</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Pega el código QR aquí"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="input-field flex-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-600 dark:border-slate-600"
              />
              <button
                onClick={handleScanQr}
                disabled={scanQrMutation.isLoading || !qrData.trim()}
                className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanQrMutation.isLoading ? 'Escaneando...' : 'Escanear'}
              </button>
            </div>
          </div>
        )}

        {/* Buscar por email */}
        {activeTab === 'search' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Buscar por correo electrónico
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="usuario@ejemplo.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="input-field pr-10"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Contenido de cada tab */}
        <div>
          {activeTab === 'friends' && (
            <>
              {friendsLoading ? (
                <LoadingOverlay message="Cargando amigos" />
              ) : !friends || friends.length === 0 ? (
                <EmptyState title="Sin amigos" description="Agrega amigos para comenzar a chatear." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/chat/${friend.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          user={{
                            name: friend.name,
                            profilePictureUrl: friend.profilePictureUrl
                          }}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{friend.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{friend.email}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{friend.points} puntos</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <>
              {requestsLoading ? (
                <LoadingOverlay message="Cargando solicitudes" />
              ) : !requests || requests.length === 0 ? (
                <EmptyState title="Sin solicitudes" description="No tienes solicitudes pendientes." />
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => (
                    <div key={request.id} className="card p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          user={{
                            name: request.sender.name,
                            profilePictureUrl: request.sender.profilePictureUrl
                          }}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{request.sender.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{request.sender.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptMutation.mutate(request.id)}
                            disabled={acceptMutation.isLoading}
                            className="p-2 rounded-lg bg-success-500 hover:bg-success-600 text-white transition-colors"
                            title="Aceptar"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('¿Estás seguro de que deseas rechazar esta solicitud de amistad?')) {
                                rejectMutation.mutate(request.id);
                              }
                            }}
                            disabled={rejectMutation.isLoading}
                            className="p-2 rounded-lg bg-error-500 hover:bg-error-600 text-white transition-colors"
                            title="Rechazar"
                            aria-label="Rechazar solicitud de amistad"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'recommendations' && (
            <>
              {recommendationsLoading ? (
                <LoadingOverlay message="Cargando recomendaciones" />
              ) : !recommendations || recommendations.length === 0 ? (
                <EmptyState
                  title="Sin recomendaciones"
                  description="Asiste a eventos para ver recomendaciones de amigos."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((recommended) => (
                    <div key={recommended.id} className="card p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar
                          user={{
                            name: recommended.name,
                            profilePictureUrl: recommended.profilePictureUrl
                          }}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">{recommended.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{recommended.email}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{recommended.points} puntos</p>
                        </div>
                      </div>
                      <button
                        onClick={() => sendRequestMutation.mutate(recommended.id)}
                        disabled={sendRequestMutation.isLoading}
                        className="btn-primary w-full text-sm"
                      >
                        {sendRequestMutation.isLoading ? 'Enviando...' : 'Enviar solicitud'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'search' && (
            <>
              {searchLoading ? (
                <LoadingOverlay message="Buscando usuarios" />
              ) : !searchResults || searchResults.length === 0 ? (
                <EmptyState
                  title="Sin resultados"
                  description={searchEmail.length < 3 ? 'Escribe al menos 3 caracteres para buscar' : 'No se encontraron usuarios'}
                />
              ) : (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div key={result.id} className="card p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          user={{
                            name: result.name,
                            profilePictureUrl: result.profilePictureUrl
                          }}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{result.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{result.email}</p>
                        </div>
                        <button
                          onClick={() => sendRequestMutation.mutate(result.id)}
                          disabled={sendRequestMutation.isLoading}
                          className="btn-primary text-sm"
                        >
                          {sendRequestMutation.isLoading ? 'Enviando...' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;

