import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Music, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const registerSchema = Yup.object({
  nom: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  email: Yup.string()
    .email('Format d\'email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
});

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nom: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await authService.register(values.nom, values.email, values.password);
        toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        navigate('/login');
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
            Rejoignez MUSICA
          </h1>
          <p className="text-sm text-textSecondary font-segoe">
            Créez votre compte pour découvrir la musique
          </p>
        </div>

        {/* Register Form */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Inscription</span>
            </CardTitle>
            <CardDescription className="text-center">
              Remplissez le formulaire pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <Input
                label="Nom complet"
                type="text"
                placeholder="Votre nom"
                {...formik.getFieldProps('nom')}
                error={formik.touched.nom && formik.errors.nom}
              />

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

              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmer votre mot de passe"
                  {...formik.getFieldProps('confirmPassword')}
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-textSecondary hover:text-textPrimary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-textSecondary font-segoe">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className="text-xs text-textSecondary font-segoe">
            🎵 En créant un compte, vous pourrez gérer vos chansons et playlists personnalisées
          </p>
        </div>
      </div>
    </div>
  );
}; 