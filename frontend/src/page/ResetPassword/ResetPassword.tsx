import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { resetPassword } from '../../services/password/passwordService';

const resetSchema = z
  .object({
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetForm = z.infer<typeof resetSchema>;

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token) return;
    setError(null);
    try {
      await resetPassword({ token, new_password: data.newPassword });
      setIsSuccess(true);
    } catch {
      setError('Token inválido o expirado. Solicitá un nuevo enlace.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8E8F0] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#CC1C1C] mb-2">
            Token no válido
          </h1>
          <p className="text-gray-600 mb-6">
            El enlace de recuperación no es válido o está incompleto.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-[#CC1C1C] hover:bg-[#a61717] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8E8F0] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Universidad del Valle"
            className="h-32 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-[#CC1C1C] mb-2">
          Nueva contraseña
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ingresá tu nueva contraseña para completar la recuperación.
        </p>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-gray-700 font-medium">
              Contraseña actualizada correctamente
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 bg-[#CC1C1C] hover:bg-[#a61717] text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('newPassword')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent transition"
                  placeholder="Ingresá tu nueva contraseña"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent transition"
                  placeholder="Confirmá tu nueva contraseña"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#CC1C1C] hover:bg-[#a61717] text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Restablecer contraseña'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-[#1565C0] hover:underline text-sm font-medium"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
