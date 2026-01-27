// Utility to get admin email from server
let cachedAdminEmail = null;

export const getAdminEmail = async () => {
  // Return cached value if available
  if (cachedAdminEmail) {
    return cachedAdminEmail;
  }

  try {
    const response = await fetch('/api/admin-email');
    if (response.ok) {
      const data = await response.json();
      cachedAdminEmail = data.adminEmail;
      return cachedAdminEmail;
    }
  } catch (error) {
    console.warn('Failed to fetch admin email from server:', error);
  }

  // Fallback to default
  return 'marketing@laxmielectronics.com';
};

// Clear cache (useful for testing or when .env changes)
export const clearAdminEmailCache = () => {
  cachedAdminEmail = null;
};

