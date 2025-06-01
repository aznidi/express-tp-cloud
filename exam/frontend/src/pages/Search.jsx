import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search as SearchIcon, 
  Filter, 
  Music, 
  Clock, 
  User, 
  Tag,
  X,
  TrendingUp
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { chansonService } from '../services/api';

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('titre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all songs
  const { data: allChansons = [], isLoading } = useQuery({
    queryKey: ['chansons'],
    queryFn: () => chansonService.getAllChansons(),
  });

  // Filter and sort songs
  const filteredAndSortedChansons = React.useMemo(() => {
    let filtered = allChansons.filter((chanson) => {
      const matchesSearch = debouncedSearchTerm === '' || 
        chanson.titre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        chanson.artiste.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesGenre = selectedGenre === '' || 
        chanson.genre.toLowerCase() === selectedGenre.toLowerCase();
      
      return matchesSearch && matchesGenre;
    });

    // Sort results
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [allChansons, debouncedSearchTerm, selectedGenre, sortBy, sortOrder]);

  const genres = [...new Set(allChansons.map(c => c.genre))];

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('titre');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || selectedGenre || sortBy !== 'titre' || sortOrder !== 'asc';

  const popularGenres = React.useMemo(() => {
    const genreCounts = allChansons.reduce((acc, chanson) => {
      acc[chanson.genre] = (acc[chanson.genre] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([genre, count]) => ({ genre, count }));
  }, [allChansons]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xxl font-poppins text-textPrimary flex items-center space-x-3 mb-2">
          <SearchIcon className="w-8 h-8" />
          <span>Recherche</span>
        </h1>
        <p className="text-sm text-textSecondary font-segoe">
          Trouvez vos chansons préférées parmi {allChansons.length} titre{allChansons.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
              <Input
                placeholder="Rechercher par titre ou artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base h-12"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-textPrimary font-poppins mb-2 block">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-md bg-surface text-textPrimary font-segoe focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Tous les genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-textPrimary font-poppins mb-2 block">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-md bg-surface text-textPrimary font-segoe focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="titre">Titre</option>
                  <option value="artiste">Artiste</option>
                  <option value="genre">Genre</option>
                  <option value="duree">Durée</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-textPrimary font-poppins mb-2 block">
                  Ordre
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full h-10 px-3 border border-border rounded-md bg-surface text-textPrimary font-segoe focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-textSecondary font-segoe">
                  {filteredAndSortedChansons.length} résultat{filteredAndSortedChansons.length > 1 ? 's' : ''} trouvé{filteredAndSortedChansons.length > 1 ? 's' : ''}
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Genres */}
      {!hasActiveFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Genres populaires</span>
            </CardTitle>
            <CardDescription>
              Explorez les genres les plus représentés dans votre collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularGenres.map(({ genre, count }) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className="p-3 border border-border rounded-md hover:bg-background/50 transition-colors text-left"
                >
                  <div className="font-medium text-textPrimary font-poppins text-sm">
                    {genre}
                  </div>
                  <div className="text-xs text-textSecondary font-segoe">
                    {count} chanson{count > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {filteredAndSortedChansons.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <SearchIcon className="w-16 h-16 text-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-poppins text-textPrimary mb-2">
              {debouncedSearchTerm || selectedGenre ? 'Aucun résultat' : 'Commencez votre recherche'}
            </h3>
            <p className="text-textSecondary font-segoe mb-6">
              {debouncedSearchTerm || selectedGenre 
                ? 'Essayez d\'ajuster vos critères de recherche'
                : 'Utilisez la barre de recherche pour trouver vos chansons'
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-poppins text-textPrimary">
              Résultats ({filteredAndSortedChansons.length})
            </h2>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedChansons.map((chanson) => (
              <Card key={chanson._id} className="fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-primary" />
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
        </div>
      )}
    </div>
  );
}; 