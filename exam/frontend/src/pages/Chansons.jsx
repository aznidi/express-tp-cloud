import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Music, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Clock,
  User,
  Tag,
  Search as SearchIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { chansonService } from '../services/api';
import toast from 'react-hot-toast';

const chansonSchema = Yup.object({
  titre: Yup.string().required('Le titre est requis'),
  artiste: Yup.string().required('L\'artiste est requis'),
  duree: Yup.number()
    .positive('La durée doit être positive')
    .required('La durée est requise'),
  genre: Yup.string().required('Le genre est requis'),
});

export const Chansons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChanson, setEditingChanson] = useState(null);
  const [filterGenre, setFilterGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch all songs
  const { data: chansons = [], isLoading, error } = useQuery({
    queryKey: ['chansons'],
    queryFn: () => chansonService.getAllChansons(),
  });

  // Create/Update song mutation
  const createUpdateMutation = useMutation({
    mutationFn: (data) => {
      if (editingChanson) {
        return chansonService.updateChanson(editingChanson._id, data);
      }
      return chansonService.createChanson(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chansons']);
      toast.success(editingChanson ? 'Chanson modifiée avec succès !' : 'Chanson ajoutée avec succès !');
      setIsModalOpen(false);
      setEditingChanson(null);
      formik.resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete song mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => chansonService.deleteChanson(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['chansons']);
      toast.success('Chanson supprimée avec succès !');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      titre: '',
      artiste: '',
      duree: '',
      genre: '',
    },
    validationSchema: chansonSchema,
    onSubmit: (values) => {
      createUpdateMutation.mutate({
        ...values,
        duree: parseInt(values.duree),
      });
    },
  });

  // Filter and search logic
  const filteredChansons = chansons.filter((chanson) => {
    const matchesSearch = searchTerm === '' || 
      chanson.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chanson.artiste.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre === '' || 
      chanson.genre.toLowerCase().includes(filterGenre.toLowerCase());
    
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(chansons.map(c => c.genre))];

  const handleEdit = (chanson) => {
    setEditingChanson(chanson);
    formik.setValues({
      titre: chanson.titre,
      artiste: chanson.artiste,
      duree: chanson.duree.toString(),
      genre: chanson.genre,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chanson ?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingChanson(null);
    formik.resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Erreur lors du chargement des chansons</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xxl font-poppins text-textPrimary flex items-center space-x-3">
            <Music className="w-8 h-8" />
            <span>Mes Chansons</span>
          </h1>
          <p className="text-sm text-textSecondary font-segoe mt-1">
            Gérez votre collection musicale ({filteredChansons.length} chanson{filteredChansons.length > 1 ? 's' : ''})
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Ajouter une chanson</span>
        </Button>
      </div>

      {/* Songs Grid */}
      {filteredChansons.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Music className="w-16 h-16 text-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-poppins text-textPrimary mb-2">
              {searchTerm || filterGenre ? 'Aucun résultat' : 'Aucune chanson'}
            </h3>
            <p className="text-textSecondary font-segoe mb-6">
              {searchTerm || filterGenre 
                ? 'Essayez d\'ajuster vos filtres de recherche'
                : 'Commencez par ajouter votre première chanson'
              }
            </p>
            {!searchTerm && !filterGenre && (
              <Button onClick={() => setIsModalOpen(true)}>
                Ajouter une chanson
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChansons.map((chanson) => (
            <Card key={chanson._id} className="fade-in group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(chanson)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(chanson._id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-textPrimary font-poppins mb-1 truncate">
                  {chanson.titre}
                </h3>
                
                <div className="space-y-2 text-sm text-textSecondary font-segoe">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="truncate">{chanson.artiste}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>{chanson.genre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(chanson.duree)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        title={editingChanson ? 'Modifier la chanson' : 'Ajouter une chanson'}
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            label="Titre"
            placeholder="Titre de la chanson"
            {...formik.getFieldProps('titre')}
            error={formik.touched.titre && formik.errors.titre}
          />

          <Input
            label="Artiste"
            placeholder="Nom de l'artiste"
            {...formik.getFieldProps('artiste')}
            error={formik.touched.artiste && formik.errors.artiste}
          />

          <Input
            label="Durée (en secondes)"
            type="number"
            placeholder="180"
            {...formik.getFieldProps('duree')}
            error={formik.touched.duree && formik.errors.duree}
          />

          <Input
            label="Genre"
            placeholder="Pop, Rock, Jazz..."
            {...formik.getFieldProps('genre')}
            error={formik.touched.genre && formik.errors.genre}
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
              {editingChanson ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}; 