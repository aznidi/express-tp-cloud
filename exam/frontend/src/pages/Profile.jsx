import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Edit3, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

export const Profile = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ nom: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, currentUserData] = await Promise.all([
        authService.getAllUsers(),
        Promise.resolve(authService.getCurrentUser())
      ]);
      setUsers(usersData);
      setCurrentUser(currentUserData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userEmail) => {
    if (currentUser && userEmail === currentUser.email) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte !');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await authService.deleteUser(userEmail);
        toast.success('Utilisateur supprimé avec succès');
        loadData(); // Reload the users list
      } catch (error) {
        toast.error('Erreur lors de la suppression');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setEditForm({ nom: user.nom, password: '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await authService.updateUser(userToEdit.email, editForm.nom, editForm.password);
      toast.success('Utilisateur mis à jour avec succès');
      setUserToEdit(null);
      setEditForm({ nom: '', password: '' });
      loadData(); // Reload the users list
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error('Error updating user:', error);
    }
  };

  const cancelEdit = () => {
    setUserToEdit(null);
    setEditForm({ nom: '', password: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Gestion des Utilisateurs
        </h1>
        <p className="text-gray-600">Gérez votre profil et les comptes utilisateurs</p>
      </div>
      
      {currentUser && (
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg relative overflow-hidden">
          {/* Decorative background gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full translate-y-4 -translate-x-4"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {currentUser.nom.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
                <p className="text-gray-600">Vos informations personnelles</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-blue-700">Nom complet</p>
                </div>
                <p className="text-xl font-bold text-gray-900 ml-11">{currentUser.nom}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-purple-700">Email</p>
                </div>
                <p className="text-xl font-bold text-gray-900 ml-11">{currentUser.email}</p>
              </div>
            </div>
            
    
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tous les Utilisateurs</h2>
              <p className="text-sm text-gray-500">Gérer les comptes utilisateurs</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Utilisateur</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date création</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white font-semibold text-sm">
                          {user.nom.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.nom}</div>
                        {currentUser && user.email === currentUser.email && (
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                              ⭐ Vous
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg transition-colors duration-200 space-x-1 group/btn"
                      >
                        <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="font-medium">Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 space-x-1 group/btn ${
                          currentUser && user.email === currentUser.email
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 hover:shadow-md'
                        }`}
                        disabled={currentUser && user.email === currentUser.email}
                        title={
                          currentUser && user.email === currentUser.email
                            ? 'Vous ne pouvez pas supprimer votre propre compte'
                            : 'Supprimer cet utilisateur'
                        }
                      >
                        <Trash2 className={`w-4 h-4 transition-transform duration-200 ${
                          currentUser && user.email === currentUser.email 
                            ? '' 
                            : 'group-hover/btn:scale-110'
                        }`} />
                        <span className="font-medium">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern 2025 Edit User Modal */}
      {userToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Modifier l'utilisateur</h3>
                    <p className="text-blue-100 text-sm">Mettre à jour les informations</p>
                  </div>
                </div>
                <button
                  onClick={cancelEdit}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
              {/* User Info Display */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Utilisateur sélectionné</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userToEdit.nom.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{userToEdit.nom}</p>
                    <p className="text-sm text-gray-500">{userToEdit.email}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Nom complet</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editForm.nom}
                      onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
                      placeholder="Entrez le nom complet"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <div className="w-4 h-4 text-gray-500">🔒</div>
                    <span>Nouveau mot de passe</span>
                    <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300 pr-12"
                      placeholder="Nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                    <span>💡</span>
                    <span>Laissez vide pour conserver le mot de passe actuel</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center space-x-2 hover:bg-gray-50 rounded-xl"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 