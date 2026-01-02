// ============================================
// ADMIN FUNCTIONS - AUTHENTICATION & CRUD
// ============================================
// Description: Admin functions for managing projects
// Requires: supabase-client.js to be loaded first
// ============================================

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Check if user is authenticated
 * Redirects to login page if not authenticated
 */
async function checkAuth() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      // Not logged in, redirect to login page
      window.location.href = 'admin-login.html';
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = 'admin-login.html';
    return null;
  }
}

/**
 * Logout current user
 */
async function logout() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    
    window.location.href = 'admin-login.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Erreur lors de la déconnexion');
  }
}

/**
 * Get current user info
 */
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Create a new project
 */
async function createProject(projectData) {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Create project error:', error);
    return { data: null, error };
  }
}

/**
 * Update an existing project
 */
async function updateProject(projectId, projectData) {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update project error:', error);
    return { data: null, error };
  }
}

/**
 * Delete a project
 */
async function deleteProject(projectId) {
  try {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete project error:', error);
    return { error };
  }
}

/**
 * Toggle project publication status
 */
async function toggleProjectPublication(projectId, currentStatus) {
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .update({ is_published: !currentStatus })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Toggle publication error:', error);
    return { data: null, error };
  }
}

/**
 * Update project competences
 */
async function updateProjectCompetences(projectId, competenceIds) {
  try {
    // First, delete existing competences
    await supabaseClient
      .from('project_competences')
      .delete()
      .eq('project_id', projectId);
    
    // Then, insert new ones
    if (competenceIds.length > 0) {
      const insertData = competenceIds.map(compId => ({
        project_id: projectId,
        competence_id: compId
      }));
      
      const { error } = await supabaseClient
        .from('project_competences')
        .insert(insertData);
      
      if (error) throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Update competences error:', error);
    return { error };
  }
}

/**
 * Add a technology to a project
 */
async function addProjectTechnology(projectId, techName, category = null) {
  try {
    const { data, error } = await supabaseClient
      .from('project_technologies')
      .insert([{
        project_id: projectId,
        name: techName,
        category: category
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Add technology error:', error);
    return { data: null, error };
  }
}

/**
 * Delete a technology from a project
 */
async function deleteProjectTechnology(techId) {
  try {
    const { error } = await supabaseClient
      .from('project_technologies')
      .delete()
      .eq('id', techId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete technology error:', error);
    return { error };
  }
}

/**
 * Add a link to a personal project
 */
async function addProjectLink(projectId, linkType, url, label) {
  try {
    const { data, error } = await supabaseClient
      .from('personal_project_links')
      .insert([{
        project_id: projectId,
        link_type: linkType,
        url: url,
        label: label
      }])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Add link error:', error);
    return { data: null, error };
  }
}

/**
 * Delete a project link
 */
async function deleteProjectLink(linkId) {
  try {
    const { error } = await supabaseClient
      .from('personal_project_links')
      .delete()
      .eq('id', linkId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete link error:', error);
    return { error };
  }
}

// ============================================
// EXPORT FOR USE IN ADMIN PAGE
// ============================================
window.adminAPI = {
  // Auth
  checkAuth,
  logout,
  getCurrentUser,
  
  // Projects CRUD
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublication,
  
  // Related data
  updateProjectCompetences,
  addProjectTechnology,
  deleteProjectTechnology,
  addProjectLink,
  deleteProjectLink,
};
