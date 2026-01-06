// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================
// Description: Client-side Supabase configuration for portfolio
// ============================================

const SUPABASE_URL = "https://luetejjufuemdqpkcbrk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZXRlamp1ZnVlbWRxcGtjYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTMwNzQsImV4cCI6MjA4Mjg2OTA3NH0.pxyT7Jva4ZyU5gCYaP1a30pSkN5dO9KMQL30lmA670I";

// Initialize Supabase client (using CDN version)
// Add this script tag to your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch all published projects
 * @param {string} type - 'academic' or 'personal' or null for all
 * @returns {Promise<Array>}
 */
async function getProjects(type = null, onlyPublished = true) {
  try {
    let query = supabaseClient
      .from("projects")
      .select(
        `
                *,
                project_competences (
                    competence:competences (*)
                ),
                project_sections (*),
                project_technologies (*),
                personal_project_links (*)
            `
      )
      .order("order_index", { ascending: true });

    if (onlyPublished) {
      query = query.eq("is_published", true);
    }

    if (type) {
      query = query.eq("project_type", type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/**
 * Fetch a single project by slug
 * @param {string} slug - Project slug
 * @returns {Promise<Object>}
 */
async function getProjectBySlug(slug) {
  try {
    const { data, error } = await supabaseClient
      .from("projects")
      .select(
        `
                *,
                project_competences (
                    competence:competences (*)
                ),
                project_sections (*),
                project_technologies (*),
                personal_project_links (*)
            `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

/**
 * Fetch all competences
 * @returns {Promise<Array>}
 */
async function getCompetences() {
  try {
    const { data, error } = await supabaseClient
      .from("competences")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching competences:", error);
    return [];
  }
}

/**
 * Get competence matrix (projects x competences)
 * @returns {Promise<Object>}
 */
async function getCompetenceMatrix() {
  try {
    const { data: projects, error: projectsError } = await supabaseClient
      .from("projects")
      .select(
        `
                id,
                title,
                slug,
                order_index,
                project_competences (
                    competence:competences (*)
                )
            `
      )
      .eq("is_published", true)
      .order("order_index", { ascending: true });

    const { data: competences, error: competencesError } = await supabaseClient
      .from("competences")
      .select("*")
      .order("order_index", { ascending: true });

    if (projectsError) throw projectsError;
    if (competencesError) throw competencesError;

    return {
      projects,
      competences,
    };
  } catch (error) {
    console.error("Error fetching competence matrix:", error);
    return { projects: [], competences: [] };
  }
}

/**
 * Fetch all veille items
 * @returns {Promise<Array>}
 */
async function getVeilles() {
  try {
    const { data, error } = await supabaseClient
      .from("veilles")
      .select("*")
      .order("published_date", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching veilles:", error);
    return [];
  }
}

/**
 * Fetch all certifications
 * @returns {Promise<Array>}
 */
async function getCertifications() {
  try {
    const { data, error } = await supabaseClient
      .from("certifications")
      .select(`
        *,
        certification_images (*),
        certification_docs (*)
      `)
      .order("issued_date", { ascending: false });

    if (error) throw error;
    // Sort images and docs by order_index in JS if needed, or rely on client sorting
    data.forEach(cert => {
        if(cert.certification_images) cert.certification_images.sort((a,b) => a.order_index - b.order_index);
        if(cert.certification_docs) cert.certification_docs.sort((a,b) => a.order_index - b.order_index);
    });
    return data;
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
}

/**
 * Fetch all documentation categories
 */
async function getDocCategories() {
  try {
    const { data, error } = await supabaseClient
      .from("doc_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching doc categories:", error);
    return [];
  }
}

/**
 * Fetch documentations
 * @param {string} slug - Optional slug to fetch single doc
 * @param {string} categoryId - Optional category to filter
 */
async function getDocumentations(slug = null, categoryId = null) {
  try {
    let query = supabaseClient
      .from("documentations")
      .select(`
        *,
        doc_categories (
          id,
          name,
          slug
        )
      `)
      .count('exact', { head: false }); // Get count if needed

    if (slug) {
      query = query.eq("slug", slug).single();
    } else {
      query = query.eq("is_published", true).order("created_at", { ascending: false });
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching documentations:", error);
    return slug ? null : [];
  }
}

/**
 * Fetch ALL documentations (for Admin)
 */
async function getAllDocumentationsAdmin() {
    try {
        const { data, error } = await supabaseClient
            .from("documentations")
            .select(`
                *,
                doc_categories (
                    id,
                    name
                )
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching admin docs:", error);
        return [];
    }
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================
window.portfolioAPI = {
  getProjects,
  getProjectBySlug,
  getCompetences,
  getCompetenceMatrix,
  getVeilles,
  getCertifications,
  getDocCategories,
  getDocumentations,
  getAllDocumentationsAdmin
};
