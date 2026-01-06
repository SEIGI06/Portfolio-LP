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
// VEILLE CRUD
// ============================================

/**
 * Create a new veille
 */
async function createVeille(veilleData) {
  try {
    const { data, error } = await supabaseClient
      .from('veilles')
      .insert([veilleData])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Create veille error:', error);
    return { data: null, error };
  }
}

/**
 * Update a veille
 */
async function updateVeille(id, updates) {
  try {
    const { data, error } = await supabaseClient
      .from('veilles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update veille error:', error);
    return { data: null, error };
  }
}

/**
 * Delete a veille
 */
async function deleteVeille(id) {
  try {
    const { error } = await supabaseClient
      .from('veilles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete veille error:', error);
    return { error };
  }
}


// ============================================
// CERTIFICATION CRUD
// ============================================

/**
 * Create a new certification
 */
async function createCertification(certData) {
  try {
    const { data, error } = await supabaseClient
      .from('certifications')
      .insert([certData])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Create certification error:', error);
    return { data: null, error };
  }
}

/**
 * Delete a certification
 */
async function deleteCertification(id) {
  try {
    const { error } = await supabaseClient
      .from('certifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete certification error:', error);
    return { error };
  }
}

/**
 * Add Image to Certification
 */
async function addCertificationImage(certId, imageUrl, caption = '', orderIndex = 0) {
  try {
    const { data, error } = await supabaseClient
      .from('certification_images')
      .insert([{
        certification_id: certId,
        image_url: imageUrl,
        caption: caption,
        order_index: orderIndex
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Add cert image error:', error);
    return { data: null, error };
  }
}

/**
 * Delete Certification Image
 */
async function deleteCertificationImage(imageId) {
  try {
    const { error } = await supabaseClient
      .from('certification_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
     console.error('Delete cert image error:', error);
     return { error };
  }
}

/**
 * Add Doc to Certification
 */
async function addCertificationDoc(certId, docUrl, name = '', orderIndex = 0) {
  try {
    const { data, error } = await supabaseClient
      .from('certification_docs')
      .insert([{
        certification_id: certId,
        doc_url: docUrl,
        name: name,
        order_index: orderIndex
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Add cert doc error:', error);
    return { data: null, error };
  }
}

/**
 * Delete Certification Doc
 */
async function deleteCertificationDoc(docId) {
  try {
    const { error } = await supabaseClient
      .from('certification_docs')
      .delete()
      .eq('id', docId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
     console.error('Delete cert doc error:', error);
     return { error };
  }
}
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

  // Veille CRUD
  createVeille,
  updateVeille,
  deleteVeille,

  // Certification CRUD
  createCertification,
  deleteCertification,
  addCertificationImage,
  deleteCertificationImage,
  addCertificationDoc,
  deleteCertificationDoc,

  // Storage
  uploadFile,
};

// ============================================
// STORAGE
// ============================================

/**
 * Upload a file to Supabase Storage
 * @param {File} file - File object to upload
 * @param {string} bucket - Storage bucket name (default: 'uploads')
 * @returns {Promise<Object>} - { publicUrl, error }
 */
async function uploadFile(file, bucket = 'uploads') {
  try {
    // 1. Sanitize filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = fileName;

    // 2. Upload
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 3. Get Public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { publicUrl: null, error };
  }
}
