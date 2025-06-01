import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Music, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Format d\'email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await authService.login(values.email, values.password);
        toast.success('Connexion réussie !');
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-surface" />
            </div>
          </div>
          <h1 className="text-xxl font-poppins text-textPrimary mb-2">
            Bienvenue sur MUSICA
          </h1>
          <p className="text-sm text-textSecondary font-segoe">
            Connectez-vous pour accéder à votre collection musicale
          </p>
        </div>

        {/* Login Form */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos informations pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && formik.errors.email}
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  {...formik.getFieldProps('password')}
                  error={formik.touched.password && formik.errors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-textSecondary hover:text-textPrimary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!formik.isValid || isLoading}
              >
                Se connecter
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-textSecondary font-segoe">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-textSecondary font-segoe">
            💡 Créez un compte ou utilisez vos identifiants existants
          </p>
        </div>
      </div>
    </div>
  );
}; 