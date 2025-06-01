import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Music, Plus, Search, List, TrendingUp, Clock, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { chansonService, playlistService, authService } from '../services/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Home = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Fetch recent songs
  const { data: chansons, isLoading: isLoadingChansons } = useQuery({
    queryKey: ['chansons'],
    queryFn: () => chansonService.getAllChansons(),
  });

  // Fetch user playlists
  const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists', currentUser?.email],
    queryFn: () => playlistService.getUserPlaylists(currentUser?.email),
    enabled: !!currentUser?.email,
  });

  const recentChansons = chansons?.slice(0, 5) || [];
  const totalChansons = chansons?.length || 0;
  const totalPlaylists = playlists?.length || 0;

  const quickActions = [
    {
      title: 'Ajouter une chanson',
      description: 'Ajoutez une nouvelle chanson à votre collection',
      icon: Plus,
      action: () => navigate('/chansons'),
      color: 'bg-primary',
    },
    {
      title: 'Créer une playlist',
      description: 'Organisez vos chansons en playlists',
      icon: List,
      action: () => navigate('/playlists'),
      color: 'bg-secondary',
    },
    {
      title: 'Rechercher',
      description: 'Trouvez rapidement vos chansons préférées',
      icon: Search,
      action: () => navigate('/search'),
      color: 'bg-green-500',
    },
  ];

  const stats = [
    {
      title: 'Chansons',
      value: totalChansons,
      icon: Music,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Playlists',
      value: totalPlaylists,
      icon: List,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Genres',
      value: new Set(chansons?.map(c => c.genre) || []).size,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Music className="w-7 h-7 text-surface" />
          </div>
          <div>
            <h1 className="text-xxl font-poppins text-textPrimary">
              Bienvenue {currentUser?.nom} ! 👋
            </h1>
            <p className="text-sm text-textSecondary font-segoe">
              Découvrez et gérez votre collection musicale
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-textSecondary font-segoe">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-textPrimary font-poppins">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Actions rapides</span>
            </CardTitle>
            <CardDescription>
              Commencez rapidement vos tâches musicales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-border rounded-md cursor-pointer hover:bg-background/50 transition-colors"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-md ${action.color} text-surface`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-textPrimary font-poppins">
                      {action.title}
                    </h3>
                    <p className="text-sm text-textSecondary font-segoe">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Songs */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Chansons récentes</span>
            </CardTitle>
            <CardDescription>
              Vos dernières chansons ajoutées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingChansons ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : recentChansons.length > 0 ? (
              <div className="space-y-3">
                {recentChansons.map((chanson) => (
                  <div
                    key={chanson._id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-md hover:bg-background/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-textPrimary font-poppins truncate">
                        {chanson.titre}
                      </h4>
                      <p className="text-sm text-textSecondary font-segoe truncate">
                        {chanson.artiste} • {chanson.genre}
                      </p>
                    </div>
                    <span className="text-xs text-textSecondary font-segoe">
                      {Math.floor(chanson.duree / 60)}:{(chanson.duree % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => navigate('/chansons')}
                >
                  Voir toutes les chansons
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                <p className="text-textSecondary font-segoe mb-4">
                  Aucune chanson encore
                </p>
                <Button onClick={() => navigate('/chansons')}>
                  Ajouter votre première chanson
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}; 