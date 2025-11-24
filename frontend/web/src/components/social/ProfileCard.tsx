import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/services/socialService';
import Avatar from '@/components/display/Avatar';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import { QrCodeIcon, EnvelopeIcon, TrophyIcon } from '@heroicons/react/24/outline';

const ProfileCard = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: ({ signal }) => getMyProfile(signal)
  });

  if (isLoading) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="card glow-on-hover bg-gradient-to-br from-primary-50/80 via-purple-50/40 to-cyan-50/30 dark:from-primary-900/30 dark:via-slate-900/50 dark:to-cyan-900/20 border-primary-200/60 dark:border-primary-800/60 animate-fade-in-up">
      <div className="flex flex-col items-center text-center space-y-4 p-6">
        <Avatar
          user={{
            name: profile.name,
            profilePictureUrl: profile.profilePictureUrl
          }}
          size="xl"
        />
        <div>
          <h2 className="text-2xl font-bold gradient-text">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
            <EnvelopeIcon className="h-4 w-4" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
            <TrophyIcon className="h-4 w-4 text-yellow-500" />
            <span>{profile.points} puntos</span>
          </div>
        </div>
        <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Mi código QR</p>
          <div className="flex justify-center">
            {profile.qrCodeBase64 ? (
              <img
                src={profile.qrCodeBase64.startsWith('data:') ? profile.qrCodeBase64 : `data:image/png;base64,${profile.qrCodeBase64}`}
                alt="QR Code"
                className="w-48 h-48 border-4 border-white/80 dark:border-slate-800/80 rounded-2xl shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500/10 hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error('Error loading QR code:', profile.qrCodeBase64?.substring(0, 50));
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-48 h-48 border-4 border-slate-300 dark:border-slate-600 rounded-lg shadow-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <QrCodeIcon className="h-24 w-24 text-slate-400 dark:text-slate-500" />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Comparte este código para que otros te agreguen como amigo
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

