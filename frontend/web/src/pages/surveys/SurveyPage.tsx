import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import TextField from '@/components/forms/TextField';
import SelectField from '@/components/forms/SelectField';
import SubmitButton from '@/components/forms/SubmitButton';
import PaginationControls from '@/components/data/PaginationControls';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { fetchSurveys, createSurvey, answerSurveyQuestion, fetchSurveyAnswers, closeSurvey } from '@/services/surveyService';
import { fetchEvents } from '@/services/eventService';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { LockClosedIcon, EyeIcon } from '@heroicons/react/24/outline';

interface CreateSurveyForm {
  eventId: number;
  title: string;
  questions: string;
}

const SurveyPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [viewingAnswers, setViewingAnswers] = useState<Record<number, boolean>>({});
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 6);

  const surveyQuery = usePaginatedQuery({
    queryKey: ['surveys', page, size],
    queryFn: (signal) => fetchSurveys({ page, size }, signal)
  });

  const canManageSurveys = user && (user.role === 'ADMIN' || user.role === 'SERVER');

  const eventsQuery = useQuery({
    queryKey: ['events', 'all'],
    queryFn: ({ signal }) => fetchEvents({ page: 0, size: 1000 }, signal),
    enabled: canManageSurveys,
    select: (data) => ({
      ...data,
      content: data.content.filter((event) => event.status === 'PENDING' || event.status === 'LIVE')
    })
  });

  const { register, handleSubmit, reset } = useForm<CreateSurveyForm>();

  const onSubmit = async (values: CreateSurveyForm) => {
    try {
      const questions = values.questions
        .split('\n')
        .map((question) => question.trim())
        .filter((q) => q && q.length > 0);

      if (questions.length === 0) {
        pushToast({ type: 'error', title: 'Error', description: 'Debes agregar al menos una pregunta con al menos un carácter' });
        return;
      }

      // Validar que todas las preguntas tengan al menos un carácter
      const invalidQuestions = questions.filter((q) => !q || q.trim().length === 0);
      if (invalidQuestions.length > 0) {
        pushToast({ type: 'error', title: 'Error', description: 'Todas las preguntas deben tener al menos un carácter' });
        return;
      }

      await createSurvey({ eventId: Number(values.eventId), title: values.title, questions });
      pushToast({ type: 'success', title: 'Encuesta creada', description: 'Listo para recolectar feedback.' });
      reset();
      surveyQuery.refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error desconocido al crear la encuesta';
      pushToast({
        type: 'error',
        title: 'No se pudo crear',
        description: errorMessage
      });
      console.error('Error creating survey:', error);
    }
  };

  const submitAnswer = async (questionId: number) => {
    if (!user) return;
    const answer = answers[questionId];
    if (!answer) {
      pushToast({ type: 'info', title: 'Respuesta requerida', description: 'Escribe tu opinión antes de enviar.' });
      return;
    }
    try {
      await answerSurveyQuestion(questionId, { answer });
      pushToast({ type: 'success', title: 'Respuesta enviada', description: 'Gracias por participar.' });
      setAnswers((prev) => ({ ...prev, [questionId]: '' }));
      surveyQuery.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error al responder', description: error.message });
    }
  };

  const closeSurveyMutation = useMutation({
    mutationFn: (surveyId: number) => closeSurvey(surveyId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Encuesta cerrada', description: 'Ya no se pueden enviar más respuestas.' });
      surveyQuery.refetch();
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message });
    }
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Encuestas' }]} />
      {user?.role !== 'USER' && (
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Crear nueva encuesta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Diseña encuestas para tus eventos activos. Cada pregunta debe ir en una línea separada.
          </p>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <SelectField
              label="Evento"
              {...register('eventId', { required: true, valueAsNumber: true })}
              required
            >
              <option value="">Selecciona un evento</option>
              {eventsQuery.data?.content.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </SelectField>
            <TextField label="Título" {...register('title', { required: true })} />
            <label className="md:col-span-2 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">Preguntas</span>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={'¿Qué te pareció el evento?\n¿Qué mejorarías?'}
                {...register('questions', { required: true })}
              />
            </label>
            <SubmitButton className="md:col-span-2 w-full md:w-auto">Crear encuesta</SubmitButton>
          </form>
        </div>
      )}
      {surveyQuery.isLoading ? (
        <LoadingOverlay message="Cargando encuestas" />
      ) : surveyQuery.data && surveyQuery.data.content.length > 0 ? (
        <div className="space-y-4">
          {surveyQuery.data.content.map((survey) => (
            <div
              key={survey.id}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{survey.title}</h3>
                  {survey.event && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Evento: {survey.event.title}</p>
                  )}
                  {!survey.event && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Encuesta de grupo</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {survey.closed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <LockClosedIcon className="h-3 w-3" />
                      Cerrada
                    </span>
                  )}
                  {canManageSurveys && !survey.closed && (
                    <button
                      onClick={() => closeSurveyMutation.mutate(survey.id)}
                      disabled={closeSurveyMutation.isLoading}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </div>
              {(() => {
                const surveyQuestions = survey.questions ?? [];
                return surveyQuestions.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Esta encuesta aún no tiene preguntas.</p>
                ) : (
                  <ul className="space-y-3">
                    {surveyQuestions.map((question) => {
                      const answersList = question.answers ?? [];
                      return (
                        <li key={question.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{question.text}</div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Respuestas registradas: {answersList.length}
                          </p>
                          {canManageSurveys && (
                            <button
                              onClick={() => {
                                setViewingAnswers((prev) => ({ ...prev, [question.id]: !prev[question.id] }));
                                if (!viewingAnswers[question.id]) {
                                  queryClient.fetchQuery({
                                    queryKey: ['surveyAnswers', survey.id],
                                    queryFn: ({ signal }) => fetchSurveyAnswers(survey.id, signal)
                                  });
                                }
                              }}
                              className="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <EyeIcon className="h-4 w-4" />
                              {viewingAnswers[question.id] ? 'Ocultar respuestas' : 'Ver respuestas'}
                            </button>
                          )}
                          {viewingAnswers[question.id] && canManageSurveys && (
                            <div className="mt-2 space-y-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                              {answersList.length === 0 ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400">Aún no hay respuestas</p>
                              ) : (
                                answersList.map((answer) => (
                                  <div key={answer.id} className="text-xs">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                      {answer.respondent.name}:
                                    </span>{' '}
                                    <span className="text-slate-600 dark:text-slate-400">{answer.answer}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          {!survey.closed && (
                            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                              <input
                                type="text"
                                value={answers[question.id] ?? ''}
                                onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                                className="flex-1 rounded-full border border-slate-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700"
                                placeholder="Escribe tu respuesta"
                                disabled={survey.closed}
                              />
                              <SubmitButton
                                type="button"
                                onClick={() => submitAnswer(question.id)}
                                className="sm:w-auto"
                                disabled={survey.closed}
                              >
                                Enviar
                              </SubmitButton>
                            </div>
                          )}
                          {survey.closed && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                              Esta encuesta está cerrada. Ya no se pueden enviar más respuestas.
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              })()}
            </div>
          ))}
          <PaginationControls
            page={surveyQuery.data.page}
            size={surveyQuery.data.size}
            totalElements={surveyQuery.data.totalElements}
            onPageChange={(nextPage) => {
              const next = new URLSearchParams(params);
              next.set('page', String(nextPage));
              next.set('size', String(size));
              setParams(next, { replace: true });
            }}
          />
        </div>
      ) : (
        <EmptyState title="Sin encuestas" description="Crea una nueva encuesta para comenzar a recolectar insights." />
      )}
    </div>
  );
};

export default SurveyPage;
