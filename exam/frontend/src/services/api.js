import axios from 'axios';

// Base URLs for different services
const AUTH_BASE_URL = 'http://localhost:8000';
const CHANSON_BASE_URL = 'http://localhost:8001';
const PLAYLIST_BASE_URL = 'http://localhost:8002';

// Axios instances for each service
const authAPI = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const chansonAPI = axios.create({
  baseURL: CHANSON_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const playlistAPI = axios.create({
  baseURL: PLAYLIST_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
const addAuthInterceptor = (api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

addAuthInterceptor(authAPI);
addAuthInterceptor(chansonAPI);
addAuthInterceptor(playlistAPI);

// Generic error handler
const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Une erreur est survenue');
  } else if (error.request) {
    throw new Error('Impossible de contacter le serveur');
  } else {
    throw new Error('Erreur de configuration');
  }
};

// Auth Service API
export const authService = {
  login: async (email, password) => {
    try {
      const response = await authAPI.post('/user/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  register: async (nom, email, password) => {
    try {
      const response = await authAPI.post('/user/register', { nom, email, password });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUser: async (email) => {
    try {
      const response = await authAPI.get(`/user/${email}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateUser: async (email, nom, password) => {
    try {
      const response = await authAPI.put(`/user/${email}`, { nom, password });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteUser: async (email) => {
    try {
      const response = await authAPI.delete(`/user/${email}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Chanson Service API
export const chansonService = {
  getAllChansons: async () => {
    try {
      const response = await chansonAPI.get('/chansons');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getChanson: async (id) => {
    try {
      const response = await chansonAPI.get(`/chanson/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createChanson: async (chansonData) => {
    try {
      const response = await chansonAPI.post('/chanson', chansonData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateChanson: async (id, chansonData) => {
    try {
      const response = await chansonAPI.put(`/chanson/${id}`, chansonData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteChanson: async (id) => {
    try {
      const response = await chansonAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  searchChansons: async (motcle) => {
    try {
      const response = await chansonAPI.get(`/chanson/recherche?motcle=${encodeURIComponent(motcle)}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  filterChansonsByGenre: async (genre) => {
    try {
      const response = await chansonAPI.get(`/chansons/filter?genre=${encodeURIComponent(genre)}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Playlist Service API
export const playlistService = {
  createPlaylist: async (nom, idUtilisateur) => {
    try {
      const response = await playlistAPI.post('/playlist', { nom, idUtilisateur });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUserPlaylists: async (email) => {
    try {
      const response = await playlistAPI.get(`/playlist/${email}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  addSongToPlaylist: async (playlistId, chansonId) => {
    try {
      const response = await playlistAPI.put(`/playlist/ajouter-chanson/${playlistId}`, { chansonId });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  removeSongFromPlaylist: async (playlistId, chansonId) => {
    try {
      const response = await playlistAPI.put(`/playlist/retirer-chanson/${playlistId}`, { chansonId });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  renamePlaylist: async (playlistId, nouveauNom) => {
    try {
      const response = await playlistAPI.put(`/playlist/renommer/${playlistId}`, { nouveauNom });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      const response = await playlistAPI.delete(`/playlist/${playlistId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
}; 