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
async function getProjects(type = null) {
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
      .eq("is_published", true)
      .order("order_index", { ascending: true });

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
      .eq("is_published", true)
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
      .eq("project_type", "academic")
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

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================
window.portfolioAPI = {
  getProjects,
  getProjectBySlug,
  getCompetences,
  getCompetenceMatrix,
};
