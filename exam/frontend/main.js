// Configuration des URLs des microservices
const API_URLS = {
    auth: 'http://localhost:8000',
    chanson: 'http://localhost:8001',
    playlist: 'http://localhost:8002'
};

// Variables globales
let currentUser = null;
let authToken = null;
let allSongs = [];
let allPlaylists = [];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadAllSongs();
});

// ==================== UTILITAIRES ====================

// Afficher un toast de notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Vérifier le statut d'authentification
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showMainApp();
    } else {
        showAuthSection();
    }
}

// Afficher la section d'authentification
function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('appSection').style.display = 'none';
    document.getElementById('authInfo').style.display = 'none';
}

// Afficher l'application principale
function showMainApp() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
    document.getElementById('authInfo').style.display = 'flex';
    document.getElementById('userName').textContent = `Bonjour, ${currentUser.nom}`;
    
    loadAllSongs();
    loadPlaylists();
}

// ==================== AUTHENTIFICATION ====================

// Changer d'onglet (login/register)
function showTab(tabName) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    forms.forEach(form => form.style.display = 'none');
    
    if (tabName === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('registerForm').style.display = 'block';
    }
}

// Connexion
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URLS.auth}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showToast('Connexion réussie !', 'success');
            showMainApp();
        } else {
            showToast(data.message || 'Erreur de connexion', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Login error:', error);
    }
}

// Inscription
async function register(event) {
    event.preventDefault();
    
    const nom = document.getElementById('registerNom').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_URLS.auth}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');
            showTab('login');
            
            // Pré-remplir le formulaire de connexion
            document.getElementById('loginEmail').value = email;
        } else {
            showToast(data.message || 'Erreur lors de l\'inscription', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Register error:', error);
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    
    showToast('Déconnexion réussie', 'info');
    showAuthSection();
}

// ==================== NAVIGATION ====================

// Afficher une section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    sections.forEach(section => section.style.display = 'none');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${sectionName}Section`).style.display = 'block';
    event.target.classList.add('active');
    
    if (sectionName === 'playlists') {
        loadPlaylists();
    }
}

// ==================== GESTION DES CHANSONS ====================

// Charger toutes les chansons
async function loadAllSongs() {
    try {
        const response = await fetch(`${API_URLS.chanson}/chansons`);
        const data = await response.json();
        
        if (response.ok) {
            allSongs = data;
            displaySongs(allSongs);
        } else {
            showToast('Erreur lors du chargement des chansons', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au service des chansons', 'error');
        console.error('Load songs error:', error);
    }
}

// Afficher les chansons
function displaySongs(songs) {
    const songsGrid = document.getElementById('songsGrid');
    
    if (songs.length === 0) {
        songsGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Aucune chanson trouvée</p>';
        return;
    }
    
    songsGrid.innerHTML = songs.map(song => `
        <div class="song-card fade-in">
            <h3>${song.titre}</h3>
            <p class="artist">${song.artiste}</p>
            <div class="song-info">
                <span><i class="fas fa-clock"></i> ${formatDuration(song.duree)}</span>
                <span><i class="fas fa-tags"></i> ${song.genre}</span>
            </div>
            <div class="song-actions">
                <button class="btn btn-primary" onclick="addToPlaylistModal('${song._id}', '${song.titre}')">
                    <i class="fas fa-plus"></i> Ajouter à playlist
                </button>
                <button class="btn btn-danger" onclick="deleteSong('${song._id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// Formatter la durée en minutes:secondes
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Ajouter une chanson
async function addSong(event) {
    event.preventDefault();
    
    const titre = document.getElementById('songTitre').value;
    const artiste = document.getElementById('songArtiste').value;
    const duree = parseInt(document.getElementById('songDuree').value);
    const genre = document.getElementById('songGenre').value;
    
    try {
        const response = await fetch(`${API_URLS.chanson}/chanson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titre, artiste, duree, genre })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Chanson ajoutée avec succès !', 'success');
            closeModal('addSongModal');
            event.target.reset();
            loadAllSongs();
        } else {
            showToast(data.message || 'Erreur lors de l\'ajout', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Add song error:', error);
    }
}

// Supprimer une chanson
async function deleteSong(songId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette chanson ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URLS.chanson}/${songId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Chanson supprimée avec succès !', 'success');
            loadAllSongs();
        } else {
            showToast(data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Delete song error:', error);
    }
}

// Rechercher des chansons
async function searchSongs() {
    const searchTerm = document.getElementById('searchSong').value.trim();
    
    if (!searchTerm) {
        displaySongs(allSongs);
        return;
    }
    
    try {
        const response = await fetch(`${API_URLS.chanson}/chanson/recherche?motcle=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (response.ok) {
            displaySongs(data);
        } else {
            showToast('Aucune chanson trouvée', 'info');
            displaySongs([]);
        }
    } catch (error) {
        showToast('Erreur lors de la recherche', 'error');
        console.error('Search songs error:', error);
    }
}

// Filtrer les chansons par genre
async function filterSongs() {
    const genre = document.getElementById('genreFilter').value;
    
    if (!genre) {
        displaySongs(allSongs);
        return;
    }
    
    try {
        const response = await fetch(`${API_URLS.chanson}/chansons/filter?genre=${encodeURIComponent(genre)}`);
        const data = await response.json();
        
        if (response.ok) {
            displaySongs(data);
        } else {
            showToast('Aucune chanson trouvée pour ce genre', 'info');
            displaySongs([]);
        }
    } catch (error) {
        showToast('Erreur lors du filtrage', 'error');
        console.error('Filter songs error:', error);
    }
}

// ==================== GESTION DES PLAYLISTS ====================

// Charger les playlists
async function loadPlaylists() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_URLS.playlist}/playlist/${currentUser.email}`);
        const data = await response.json();
        
        if (response.ok) {
            allPlaylists = data;
            displayPlaylists(allPlaylists);
        } else {
            allPlaylists = [];
            displayPlaylists([]);
        }
    } catch (error) {
        showToast('Erreur de connexion au service des playlists', 'error');
        console.error('Load playlists error:', error);
    }
}

// Afficher les playlists
function displayPlaylists(playlists) {
    const playlistsGrid = document.getElementById('playlistsGrid');
    
    if (playlists.length === 0) {
        playlistsGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">Aucune playlist trouvée. Créez votre première playlist !</p>';
        return;
    }
    
    playlistsGrid.innerHTML = playlists.map(playlist => `
        <div class="playlist-card fade-in">
            <h3>${playlist.nom}</h3>
            <div class="playlist-info">
                <p><i class="fas fa-music"></i> ${playlist.listeChansons ? playlist.listeChansons.length : 0} chanson(s)</p>
                <p><i class="fas fa-calendar"></i> ${new Date(playlist.created_at).toLocaleDateString()}</p>
            </div>
            <div class="playlist-actions">
                <button class="btn btn-secondary" onclick="renamePlaylistModal('${playlist._id}', '${playlist.nom}')">
                    <i class="fas fa-edit"></i> Renommer
                </button>
                <button class="btn btn-danger" onclick="deletePlaylist('${playlist._id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// Créer une playlist
async function createPlaylist(event) {
    event.preventDefault();
    
    const nom = document.getElementById('playlistNom').value;
    
    try {
        const response = await fetch(`${API_URLS.playlist}/playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nom, 
                idUtilisateur: currentUser.id 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Playlist créée avec succès !', 'success');
            closeModal('createPlaylistModal');
            event.target.reset();
            loadPlaylists();
        } else {
            showToast(data.message || 'Erreur lors de la création', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Create playlist error:', error);
    }
}

// Modal pour ajouter une chanson à une playlist
function addToPlaylistModal(songId, songTitle) {
    if (allPlaylists.length === 0) {
        showToast('Créez d\'abord une playlist', 'info');
        return;
    }
    
    const playlistOptions = allPlaylists.map(playlist => 
        `<option value="${playlist._id}">${playlist.nom}</option>`
    ).join('');
    
    const modalHtml = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-plus"></i> Ajouter "${songTitle}" à une playlist</h3>
                <button class="close" onclick="closeModal('addToPlaylistModal')">&times;</button>
            </div>
            <form onsubmit="addSongToPlaylist(event, '${songId}')">
                <div style="padding: 25px;">
                    <div class="input-group">
                        <i class="fas fa-list"></i>
                        <select id="playlistSelect" required>
                            <option value="">Choisir une playlist</option>
                            ${playlistOptions}
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('addToPlaylistModal')">Annuler</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Ajouter
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'addToPlaylistModal';
    modal.className = 'modal';
    modal.innerHTML = modalHtml;
    modal.style.display = 'block';
    
    document.body.appendChild(modal);
}

// Ajouter une chanson à une playlist
async function addSongToPlaylist(event, songId) {
    event.preventDefault();
    
    const playlistId = document.getElementById('playlistSelect').value;
    
    try {
        const response = await fetch(`${API_URLS.playlist}/playlist/ajouter-chanson/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chansonId: songId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Chanson ajoutée à la playlist !', 'success');
            closeModal('addToPlaylistModal');
            loadPlaylists();
        } else {
            showToast(data.message || 'Erreur lors de l\'ajout', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Add song to playlist error:', error);
    }
}

// Modal pour renommer une playlist
function renamePlaylistModal(playlistId, currentName) {
    const modalHtml = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> Renommer la playlist</h3>
                <button class="close" onclick="closeModal('renamePlaylistModal')">&times;</button>
            </div>
            <form onsubmit="renamePlaylist(event, '${playlistId}')">
                <div style="padding: 25px;">
                    <div class="input-group">
                        <i class="fas fa-list"></i>
                        <input type="text" id="newPlaylistName" value="${currentName}" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('renamePlaylistModal')">Annuler</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Renommer
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'renamePlaylistModal';
    modal.className = 'modal';
    modal.innerHTML = modalHtml;
    modal.style.display = 'block';
    
    document.body.appendChild(modal);
}

// Renommer une playlist
async function renamePlaylist(event, playlistId) {
    event.preventDefault();
    
    const nouveauNom = document.getElementById('newPlaylistName').value;
    
    try {
        const response = await fetch(`${API_URLS.playlist}/playlist/renommer/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nouveauNom })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Playlist renommée avec succès !', 'success');
            closeModal('renamePlaylistModal');
            loadPlaylists();
        } else {
            showToast(data.message || 'Erreur lors du renommage', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Rename playlist error:', error);
    }
}

// Supprimer une playlist
async function deletePlaylist(playlistId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URLS.playlist}/playlist/${playlistId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Playlist supprimée avec succès !', 'success');
            loadPlaylists();
        } else {
            showToast(data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error('Delete playlist error:', error);
    }
}

// ==================== GESTION DES MODALS ====================

// Afficher une modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Fermer une modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Supprimer les modals dynamiques
        if (modalId === 'addToPlaylistModal' || modalId === 'renamePlaylistModal') {
            modal.remove();
        }
    }
}

// Fermer les modals en cliquant en dehors
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        
        // Supprimer les modals dynamiques
        if (event.target.id === 'addToPlaylistModal' || event.target.id === 'renamePlaylistModal') {
            event.target.remove();
        }
    }
}

// ==================== ÉVÉNEMENTS ====================

// Recherche en temps réel
document.getElementById('searchSong').addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displaySongs(allSongs);
    } else {
        const filteredSongs = allSongs.filter(song => 
            song.titre.toLowerCase().includes(searchTerm) || 
            song.artiste.toLowerCase().includes(searchTerm)
        );
        displaySongs(filteredSongs);
    }
});

// Réinitialiser les filtres
document.getElementById('genreFilter').addEventListener('change', function() {
    if (this.value === '') {
        displaySongs(allSongs);
    }
});
