import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { fetchSurveys, createSurvey, answerSurveyQuestion } from '@/services/surveyService';

interface CreateSurveyForm {
  eventId: number;
  title: string;
  questions: string;
}

const SurveyPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const surveyQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: ({ signal }) => fetchSurveys({}, signal)
  });

  const { register, handleSubmit, reset } = useForm<CreateSurveyForm>();

  const onSubmit = async (values: CreateSurveyForm) => {
    try {
      const questions = values.questions
        .split('\n')
        .map((question) => question.trim())
        .filter(Boolean);
      await createSurvey({ eventId: Number(values.eventId), title: values.title, questions });
      pushToast({ type: 'success', title: 'Encuesta creada', description: 'Listo para recolectar feedback.' });
      reset();
      surveyQuery.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'No se pudo crear', description: error.message });
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
      await answerSurveyQuestion(questionId, { userId: user.id, answer });
      pushToast({ type: 'success', title: 'Respuesta enviada', description: 'Gracias por participar.' });
      setAnswers((prev) => ({ ...prev, [questionId]: '' }));
      surveyQuery.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error al responder', description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Encuestas' }]} />
      {user?.role !== 'USER' && (
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Crear nueva encuesta</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Diseña encuestas para tus eventos activos. Cada pregunta debe ir en una línea separada.
          </p>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <TextField label="ID del evento" type="number" {...register('eventId', { required: true })} />
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
      ) : surveyQuery.data && surveyQuery.data.length > 0 ? (
        <div className="grid gap-4">
          {surveyQuery.data.map((survey) => (
            <div
              key={survey.id}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{survey.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Evento: {survey.event.title}</p>
              </div>
              {survey.questions.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Esta encuesta aún no tiene preguntas.</p>
              ) : (
                <ul className="space-y-3">
                  {survey.questions.map((question) => (
                    <li key={question.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{question.text}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Respuestas registradas: {question.answers.length}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          value={answers[question.id] ?? ''}
                          onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                          className="flex-1 rounded-full border border-slate-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700"
                          placeholder="Escribe tu respuesta"
                        />
                        <SubmitButton type="button" onClick={() => submitAnswer(question.id)} className="sm:w-auto">
                          Enviar
                        </SubmitButton>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Sin encuestas" description="Crea una nueva encuesta para comenzar a recolectar insights." />
      )}
    </div>
  );
};

export default SurveyPage;
