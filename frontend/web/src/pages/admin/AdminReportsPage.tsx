import { useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, updateReportStatus, Report } from '@/services/reportService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import StatusBadge from '@/components/data/StatusBadge';
import { formatDateTime } from '@/utils/formatters';
import { CheckCircleIcon, XCircleIcon, ClockIcon, FlagIcon } from '@heroicons/react/24/outline';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  REVIEWED: 'Revisado',
  RESOLVED: 'Resuelto',
  DISMISSED: 'Descartado'
};

const typeLabels: Record<string, string> = {
  EVENT: 'Evento',
  PROFILE: 'Perfil',
  GROUP: 'Grupo',
  POST: 'Publicación'
};

const AdminReportsPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', { status: selectedStatus }],
    queryFn: ({ signal }) => getReports({ page: 0, size: 100, status: selectedStatus }, signal),
    enabled: Boolean(user && user.role === 'ADMIN')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED' }) =>
      updateReportStatus(reportId, status),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Estado actualizado', description: 'El estado del reporte fue actualizado.' });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setSelectedReport(null);
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo actualizar el estado.' });
    }
  });

  if (!user || user.role !== 'ADMIN') {
    return <EmptyState title="Acceso denegado" description="Solo los administradores pueden ver esta página." />;
  }

  const reports = reportsData?.content || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Administración', to: '/admin' }, { label: 'Reportes' }]} />

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reportes</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Gestiona los reportes de usuarios</p>
          </div>
          <div className="flex gap-2">
            {['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingOverlay message="Cargando reportes" />
        ) : reports.length === 0 ? (
          <EmptyState
            title="Sin reportes"
            description={`No hay reportes con estado "${statusLabels[selectedStatus]}".`}
          />
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FlagIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {typeLabels[report.type]} #{report.targetId}
                      </span>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      Motivo: {report.reason}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                      {report.details}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>Reportado por: {report.reportedBy.name}</span>
                      <span>{formatDateTime(report.createdAt)}</span>
                    </div>
                  </div>
                  {report.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ reportId: report.id, status: 'REVIEWED' });
                        }}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        title="Marcar como revisado"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ reportId: report.id, status: 'DISMISSED' });
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title="Descartar"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReport(null)}>
          <div className="card bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detalle del Reporte</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {typeLabels[selectedReport.type]} #{selectedReport.targetId}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <XCircleIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                <StatusBadge status={selectedReport.status} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Motivo</label>
                <p className="text-sm text-slate-900 dark:text-white">{selectedReport.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Detalles</label>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{selectedReport.details}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Reportado por</label>
                <p className="text-sm text-slate-900 dark:text-white">{selectedReport.reportedBy.name} ({selectedReport.reportedBy.email})</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                <p className="text-sm text-slate-600 dark:text-slate-400">{formatDateTime(selectedReport.createdAt)}</p>
              </div>

              {selectedReport.reviewedAt && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Revisado</label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDateTime(selectedReport.reviewedAt)} por {selectedReport.reviewedBy?.name || 'Administrador'}
                  </p>
                </div>
              )}

              {selectedReport.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({ reportId: selectedReport.id, status: 'REVIEWED' });
                    }}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                    disabled={updateStatusMutation.isLoading}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Marcar como Revisado
                  </button>
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({ reportId: selectedReport.id, status: 'RESOLVED' });
                    }}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    disabled={updateStatusMutation.isLoading}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Resolver
                  </button>
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({ reportId: selectedReport.id, status: 'DISMISSED' });
                    }}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    disabled={updateStatusMutation.isLoading}
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Descartar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;



