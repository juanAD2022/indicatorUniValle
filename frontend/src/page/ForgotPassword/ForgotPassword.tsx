import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { forgotPassword } from '../../services/password/passwordService';

const forgotSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setError(null);
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    }
  };

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
          Recuperar contraseña
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ingresá tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-gray-700">
              Si el correo está registrado, recibirás un enlace de recuperación.
            </p>
            <p className="text-sm text-gray-500">
              El enlace expira en 15 minutos. Revisá tu bandeja de entrada.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-[#1565C0] hover:underline font-medium"
            >
              Volver al inicio de sesión
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent transition"
                  placeholder="Ingresá tu correo"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                    Enviando...
                  </>
                ) : (
                  'Enviar enlace de recuperación'
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
