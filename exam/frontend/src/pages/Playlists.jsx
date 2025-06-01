import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  List, 
  Plus, 
  Edit, 
  Trash2, 
  Music,
  Clock,
  User,
  PlayCircle,
  Minus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { playlistService, chansonService, authService } from '../services/api';
import toast from 'react-hot-toast';

const playlistSchema = Yup.object({
  nom: Yup.string().required('Le nom de la playlist est requis'),
});

export const Playlists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const queryClient = useQueryClient();
  const currentUser = authService.getCurrentUser();

  // Fetch user playlists
  const { data: playlists = [], isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists', currentUser?.email],
    queryFn: () => playlistService.getUserPlaylists(currentUser?.email),
    enabled: !!currentUser?.email,
  });

  // Fetch all songs for adding to playlists
  const { data: allChansons = [] } = useQuery({
    queryKey: ['chansons'],
    queryFn: () => chansonService.getAllChansons(),
  });

  // Create/Update playlist mutation
  const createUpdateMutation = useMutation({
    mutationFn: (data) => {
      if (editingPlaylist) {
        return playlistService.renamePlaylist(editingPlaylist._id, data.nom);
      }
      return playlistService.createPlaylist(data.nom, currentUser?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success(editingPlaylist ? 'Playlist modifiée avec succès !' : 'Playlist créée avec succès !');
      setIsModalOpen(false);
      setEditingPlaylist(null);
      formik.resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete playlist mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => playlistService.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('Playlist supprimée avec succès !');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Add song to playlist mutation
  const addSongMutation = useMutation({
    mutationFn: ({ playlistId, chansonId }) => 
      playlistService.addSongToPlaylist(playlistId, chansonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('Chanson ajoutée à la playlist !');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Remove song from playlist mutation
  const removeSongMutation = useMutation({
    mutationFn: ({ playlistId, chansonId }) => 
      playlistService.removeSongFromPlaylist(playlistId, chansonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success('Chanson retirée de la playlist !');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      nom: '',
    },
    validationSchema: playlistSchema,
    onSubmit: (values) => {
      createUpdateMutation.mutate(values);
    },
  });

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    formik.setValues({
      nom: playlist.nom,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPlaylist(null);
    formik.resetForm();
  };

  const handleAddSong = (chansonId) => {
    if (selectedPlaylist) {
      addSongMutation.mutate({
        playlistId: selectedPlaylist._id,
        chansonId: chansonId
      });
    }
  };

  const handleRemoveSong = (chansonId) => {
    if (selectedPlaylist) {
      removeSongMutation.mutate({
        playlistId: selectedPlaylist._id,
        chansonId: chansonId
      });
    }
  };

  const getPlaylistSongs = (playlist) => {
    return allChansons.filter(chanson => 
      playlist.listeChansons.includes(chanson._id)
    );
  };

  const getAvailableSongs = (playlist) => {
    return allChansons.filter(chanson => 
      !playlist.listeChansons.includes(chanson._id)
    );
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoadingPlaylists) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xxl font-poppins text-textPrimary flex items-center space-x-3">
            <List className="w-8 h-8" />
            <span>Mes Playlists</span>
          </h1>
          <p className="text-sm text-textSecondary font-segoe mt-1">
            Organisez vos chansons en collections ({playlists.length} playlist{playlists.length > 1 ? 's' : ''})
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Créer une playlist</span>
        </Button>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <List className="w-16 h-16 text-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-poppins text-textPrimary mb-2">
              Aucune playlist
            </h3>
            <p className="text-textSecondary font-segoe mb-6">
              Créez votre première playlist pour organiser vos chansons
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Créer une playlist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const playlistSongs = getPlaylistSongs(playlist);
            const totalDuration = playlistSongs.reduce((acc, song) => acc + song.duree, 0);
            
            return (
              <Card key={playlist._id} className="fade-in group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <List className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(playlist)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(playlist._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-textPrimary font-poppins mb-2 truncate">
                    {playlist.nom}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-textSecondary font-segoe mb-4">
                    <div className="flex items-center space-x-2">
                      <Music className="w-4 h-4" />
                      <span>{playlistSongs.length} chanson{playlistSongs.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setIsAddSongModalOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Gérer les chansons
                    </Button>
                    
                    {playlistSongs.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-textSecondary font-segoe">Aperçu :</p>
                        {playlistSongs.slice(0, 3).map((song) => (
                          <div key={song._id} className="text-xs text-textSecondary font-segoe truncate">
                            • {song.titre} - {song.artiste}
                          </div>
                        ))}
                        {playlistSongs.length > 3 && (
                          <div className="text-xs text-textSecondary font-segoe">
                            ... et {playlistSongs.length - 3} autre{playlistSongs.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal for Create/Edit Playlist */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        title={editingPlaylist ? 'Modifier la playlist' : 'Créer une playlist'}
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Nom de la playlist"
            placeholder="Ma playlist favorite"
            {...formik.getFieldProps('nom')}
            error={formik.touched.nom && formik.errors.nom}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createUpdateMutation.isPending}
              disabled={!formik.isValid || createUpdateMutation.isPending}
              className="flex-1"
            >
              {editingPlaylist ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Managing Songs */}
      <Modal 
        isOpen={isAddSongModalOpen} 
        onClose={() => {
          setIsAddSongModalOpen(false);
          setSelectedPlaylist(null);
        }}
        title={`Gérer les chansons - ${selectedPlaylist?.nom}`}
        size="lg"
      >
        {selectedPlaylist && (
          <div className="space-y-6">
            {/* Current Songs */}
            <div>
              <h3 className="font-medium text-textPrimary font-poppins mb-3">
                Chansons dans la playlist ({getPlaylistSongs(selectedPlaylist).length})
              </h3>
              {getPlaylistSongs(selectedPlaylist).length === 0 ? (
                <p className="text-textSecondary font-segoe text-sm">
                  Aucune chanson dans cette playlist
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getPlaylistSongs(selectedPlaylist).map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-3 border border-border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                          <Music className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-textPrimary font-poppins text-sm">
                            {song.titre}
                          </p>
                          <p className="text-xs text-textSecondary font-segoe">
                            {song.artiste} • {formatDuration(song.duree)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSong(song._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Songs */}
            <div>
              <h3 className="font-medium text-textPrimary font-poppins mb-3">
                Chansons disponibles ({getAvailableSongs(selectedPlaylist).length})
              </h3>
              {getAvailableSongs(selectedPlaylist).length === 0 ? (
                <p className="text-textSecondary font-segoe text-sm">
                  Toutes vos chansons sont déjà dans cette playlist
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getAvailableSongs(selectedPlaylist).map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-3 border border-border rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                          <Music className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-textPrimary font-poppins text-sm">
                            {song.titre}
                          </p>
                          <p className="text-xs text-textSecondary font-segoe">
                            {song.artiste} • {formatDuration(song.duree)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSong(song._id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}; 