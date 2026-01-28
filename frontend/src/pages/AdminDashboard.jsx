import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formTypeFilter, setFormTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // 'today', 'week', 'month', or ''
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editingSEO, setEditingSEO] = useState(null);
  const [smtpSettings, setSmtpSettings] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [emailTemplateView, setEmailTemplateView] = useState('list'); // 'grid' or 'list'
  const [seoView, setSeoView] = useState('list'); // 'grid' or 'list'
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from URL pathname
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path === '/admin/submissions') return 'submissions';
    if (path === '/admin/seo') return 'seo';
    if (path === '/admin/settings') return 'settings';
    return 'dashboard'; // Default to dashboard
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      // Set active tab from URL pathname
      const tabFromUrl = getTabFromPath();
      setActiveTab(tabFromUrl);
      
      // Only fetch stats if we have a valid token
      if (token && token.trim() !== '') {
        fetchStats();
      }
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  }, [navigate, location.pathname]); // Include location.pathname to react to URL changes

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'seo') {
      fetchSEO();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [currentPage, searchTerm, formTypeFilter, dateFilter]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(formTypeFilter && { formType: formTypeFilter }),
        ...(dateFilter && { dateFilter: dateFilter }),
      });

      const response = await fetch(`/api/admin/submissions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
    }
  };

  const fetchSEO = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/seo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSeoData(data.data);
      }
    } catch (error) {
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleSaveSEO = async (seoItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoItem),
      });

      const data = await response.json();

      if (data.success) {
        fetchSEO();
        setEditingSEO(null);
        alert('SEO metadata saved successfully!');
      }
    } catch (error) {
      alert('Error saving SEO metadata');
    }
  };

  const handleInitializeSEO = async () => {
    if (!window.confirm('This will initialize SEO metadata for all pages. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/init-seo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('SEO metadata initialized successfully!');
        fetchSEO();
      } else {
        alert(data.message || 'Error initializing SEO metadata');
      }
    } catch (error) {
      alert('Error initializing SEO metadata. Please run `npm run init:seo` from the command line.');
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      // Fetch SMTP settings
      const smtpResponse = await fetch('/api/admin/smtp-settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (smtpResponse.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }
      
      const smtpData = await smtpResponse.json();
      if (smtpData.success) {
        setSmtpSettings(smtpData);
      }

      // Fetch email templates
      const templatesResponse = await fetch('/api/admin/email-templates', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (templatesResponse.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
        return;
      }
      
      const templatesData = await templatesResponse.json();
      if (templatesData.success) {
        setEmailTemplates(templatesData.data || []);
      }
    } catch (error) {
    }
  };

  const handleSaveSMTP = async (smtpData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/smtp-settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smtpData),
      });

      const data = await response.json();

      if (data.success) {
        alert('SMTP settings saved successfully!');
        fetchSettings();
      } else {
        alert(data.message || 'Error saving SMTP settings');
      }
    } catch (error) {
      alert('Error saving SMTP settings');
    }
  };

  const handleSaveTemplate = async (template) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      const data = await response.json();

      if (data.success) {
        alert('Email template saved successfully!');
        fetchSettings();
        setEditingTemplate(null);
      } else {
        alert(data.message || 'Error saving email template');
      }
    } catch (error) {
      alert('Error saving email template');
    }
  };

  const exportSubmissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch all filtered submissions (not just current page)
      const params = new URLSearchParams({
        page: 1,
        limit: '10000', // Large limit to get all filtered results
        ...(searchTerm && { search: searchTerm }),
        ...(formTypeFilter && { formType: formTypeFilter }),
        ...(dateFilter && { dateFilter: dateFilter }),
      });

      const response = await fetch(`/api/admin/submissions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        alert('No data to export');
        return;
      }

      const filteredData = data.data;
      
      // Build filename with filter information
      const dateFilterText = dateFilter ? `-${dateFilter}` : '';
      const formTypeText = formTypeFilter ? `-${formTypeFilter}` : '';
      const searchText = searchTerm ? `-search-${searchTerm.substring(0, 10).replace(/\s+/g, '-')}` : '';
      const filterText = `${dateFilterText}${formTypeText}${searchText}` || '-all';
      
      const csv = [
        ['ID', 'Name', 'Email', 'Phone', 'Form Type', 'Organisation', 'City', 'State', 'Message', 'Requirement', 'Submitted Date & Time', 'CAD File', 'RFQ File'].join(','),
        ...filteredData.map(s => [
          s.id,
          s.name || '',
          s.email,
          s.phone || '',
          s.form_type,
          s.organisation_name || '',
          s.city || '',
          s.state || '',
          (s.message || '').replace(/"/g, '""'),
          (s.requirement || '').replace(/"/g, '""'),
          s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '',
          s.cad_file ? (s.cad_file.split('/').pop() || s.cad_file) : '',
          s.rfq_file ? (s.rfq_file.split('/').pop() || s.rfq_file) : ''
        ].map(field => `"${String(field || '')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions${filterText}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data. Please try again.');
    }
  };

  const handleFormTypeClick = (formType) => {
    setFormTypeFilter(formType);
    setActiveTab('submissions');
    setCurrentPage(1);
    navigate('/admin/submissions', { replace: true });
  };

  const clearFilter = () => {
    setFormTypeFilter('');
    setSearchTerm('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const handleDateFilterClick = (filterType) => {
    setDateFilter(filterType);
    setFormTypeFilter('');
    setSearchTerm('');
    setCurrentPage(1);
    setActiveTab('submissions');
    navigate('/admin/submissions', { replace: true });
    // Fetch submissions will be triggered by useEffect
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-x-hidden">
      {/* Sidebar - Fixed Height, No Scroll */}
      <aside className="w-72 bg-gradient-to-b from-[#08222B] to-[#0a2d3a] text-white fixed left-0 top-0 h-screen flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <img 
                src="/assets/logo.png" 
                alt="Laxmi Electronics Logo" 
                className="h-10 w-auto"
              />
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2 text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-300">{user?.fullName || user?.username}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              navigate('/admin/dashboard', { replace: true });
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'dashboard'
                ? 'bg-white/20 shadow-lg backdrop-blur-sm border-l-4 border-white'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('submissions');
              navigate('/admin/submissions', { replace: true });
              fetchSubmissions();
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'submissions'
                ? 'bg-white/20 shadow-lg backdrop-blur-sm border-l-4 border-white'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Form Submissions</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('seo');
              navigate('/admin/seo', { replace: true });
              fetchSEO();
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'seo'
                ? 'bg-white/20 shadow-lg backdrop-blur-sm border-l-4 border-white'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium">SEO Management</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              navigate('/admin/settings', { replace: true });
              fetchSettings();
            }}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
              activeTab === 'settings'
                ? 'bg-white/20 shadow-lg backdrop-blur-sm border-l-4 border-white'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-x-hidden max-w-full">
        <div className="p-6 max-w-[1920px] mx-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards - Clickable */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <button
                    onClick={() => handleDateFilterClick('')}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all text-left cursor-pointer"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Submissions</h3>
                    <p className="text-3xl font-bold text-[#08222B]">{stats.total}</p>
                    <p className="text-xs text-gray-400 mt-2">Click to view all</p>
                  </button>
                  <button
                    onClick={() => handleDateFilterClick('today')}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-all text-left cursor-pointer"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Today</h3>
                    <p className="text-3xl font-bold text-[#08222B]">{stats.today}</p>
                    <p className="text-xs text-gray-400 mt-2">Click to view today's</p>
                  </button>
                  <button
                    onClick={() => handleDateFilterClick('week')}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-all text-left cursor-pointer"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">This Week</h3>
                    <p className="text-3xl font-bold text-[#08222B]">{stats.thisWeek}</p>
                    <p className="text-xs text-gray-400 mt-2">Click to view this week's</p>
                  </button>
                  <button
                    onClick={() => handleDateFilterClick('month')}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all text-left cursor-pointer"
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-[#08222B]">{stats.thisMonth}</p>
                    <p className="text-xs text-gray-400 mt-2">Click to view this month's</p>
                  </button>
                </div>
              )}

              {/* Form Type Cards - Clickable with Charts */}
              {stats && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Submissions by Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* All Forms Card */}
                    <button
                      onClick={() => {
                        clearFilter();
                        setActiveTab('submissions');
                        fetchSubmissions();
                      }}
                      className="bg-white rounded-lg shadow p-6 border-2 border-gray-200 hover:border-[#08222B] hover:shadow-lg transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">All Forms</h4>
                        <span className="text-2xl">📋</span>
                      </div>
                      <p className="text-3xl font-bold text-[#08222B] mb-1">{stats.total}</p>
                      <p className="text-sm text-gray-500">Total submissions</p>
                    </button>

                    {/* Contact Form Card */}
                    {(() => {
                      const contactCount = stats.byType?.find(t => t.form_type === 'contact')?.count || 0;
                      return (
                        <button
                          onClick={() => handleFormTypeClick('contact')}
                          className="bg-white rounded-lg shadow p-6 border-2 border-blue-500 hover:shadow-lg transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Contact</h4>
                            <span className="text-2xl">📧</span>
                          </div>
                          <p className="text-3xl font-bold text-[#08222B] mb-1">{contactCount}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: stats.total > 0 ? `${(contactCount / stats.total) * 100}%` : '0%' }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click to view details</p>
                        </button>
                      );
                    })()}

                    {/* Quote Request Card */}
                    {(() => {
                      const quoteCount = stats.byType?.find(t => t.form_type === 'quote')?.count || 0;
                      return (
                        <button
                          onClick={() => handleFormTypeClick('quote')}
                          className="bg-white rounded-lg shadow p-6 border-2 border-green-500 hover:shadow-lg transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Quote Request</h4>
                            <span className="text-2xl">💰</span>
                          </div>
                          <p className="text-3xl font-bold text-[#08222B] mb-1">{quoteCount}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: stats.total > 0 ? `${(quoteCount / stats.total) * 100}%` : '0%' }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click to view details</p>
                        </button>
                      );
                    })()}

                    {/* Certification Card */}
                    {(() => {
                      const certCount = stats.byType?.find(t => t.form_type === 'certification')?.count || 0;
                      return (
                        <button
                          onClick={() => handleFormTypeClick('certification')}
                          className="bg-white rounded-lg shadow p-6 border-2 border-purple-500 hover:shadow-lg transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Certification</h4>
                            <span className="text-2xl">🏆</span>
                          </div>
                          <p className="text-3xl font-bold text-[#08222B] mb-1">{certCount}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: stats.total > 0 ? `${(certCount / stats.total) * 100}%` : '0%' }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click to view details</p>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Charts Section */}
                  {stats.byType && stats.byType.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Distribution</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-4">Bar Chart</h4>
                          <div className="space-y-3">
                            {stats.byType.map((item, index) => {
                              const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                              const formTypeLabels = {
                                contact: 'Contact',
                                quote: 'Quote Request',
                                certification: 'Certification'
                              };
                              return (
                                <div key={index}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700">{formTypeLabels[item.form_type] || item.form_type}</span>
                                    <span className="text-sm font-bold text-[#08222B]">{item.count}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                      className={`h-4 rounded-full transition-all ${
                                        item.form_type === 'contact' ? 'bg-blue-500' :
                                        item.form_type === 'quote' ? 'bg-green-500' :
                                        'bg-purple-500'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pie Chart (Visual Representation) */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-4">Distribution Chart</h4>
                          <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                {(() => {
                                  let currentOffset = 0;
                                  const total = stats.total;
                                  return stats.byType.map((item, index) => {
                                    const percentage = total > 0 ? (item.count / total) * 100 : 0;
                                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                                    const strokeDashoffset = -currentOffset;
                                    const color = item.form_type === 'contact' ? '#3b82f6' :
                                                 item.form_type === 'quote' ? '#10b981' :
                                                 '#a855f7';
                                    currentOffset += percentage;
                                    return (
                                      <circle
                                        key={index}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="20"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        className="transition-all"
                                      />
                                    );
                                  });
                                })()}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-[#08222B]">{stats.total}</p>
                                  <p className="text-xs text-gray-500">Total</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            {stats.byType.map((item, index) => {
                              const formTypeLabels = {
                                contact: 'Contact',
                                quote: 'Quote Request',
                                certification: 'Certification'
                              };
                              const color = item.form_type === 'contact' ? 'bg-blue-500' :
                                           item.form_type === 'quote' ? 'bg-green-500' :
                                           'bg-purple-500';
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded ${color}`}></div>
                                  <span className="text-sm text-gray-700">{formTypeLabels[item.form_type] || item.form_type}</span>
                                  <span className="text-sm font-semibold text-gray-900 ml-auto">{item.count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              {/* Active Filter Display */}
              {(formTypeFilter || searchTerm || dateFilter) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {dateFilter && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                          {dateFilter === 'today' && 'Today'}
                          {dateFilter === 'week' && 'This Week'}
                          {dateFilter === 'month' && 'This Month'}
                        </span>
                      )}
                      {formTypeFilter && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                          Type: {formTypeFilter}
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Search: {searchTerm}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilter}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name, email, or message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Form Type</label>
                    <select
                      value={formTypeFilter}
                      onChange={(e) => {
                        setFormTypeFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="contact">Contact</option>
                      <option value="quote">Quote Request</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={exportSubmissions}
                      className="flex-1 px-4 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors flex items-center justify-center gap-2"
                    >
                      <span>📥</span>
                      <span>Export CSV</span>
                    </button>
                    {(formTypeFilter || searchTerm || dateFilter) && (
                      <button
                        onClick={clearFilter}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Count and Export */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-[#08222B]">{submissions.length}</span> submission{submissions.length !== 1 ? 's' : ''}
                  {dateFilter && (
                    <span>
                      {' '}for{' '}
                      {dateFilter === 'today' && 'today'}
                      {dateFilter === 'week' && 'this week'}
                      {dateFilter === 'month' && 'this month'}
                    </span>
                  )}
                  {formTypeFilter && ` for ${formTypeFilter} forms`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
                {submissions.length > 0 && (
                  <button
                    onClick={exportSubmissions}
                    className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <span>📥</span>
                    <span>Export {
                      dateFilter ? (dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month') :
                      formTypeFilter ? formTypeFilter :
                      'All'
                    } Data</span>
                  </button>
                )}
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                            No submissions found
                          </td>
                        </tr>
                      ) : (
                        submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.phone || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {submission.form_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(submission.submitted_at)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {[submission.cad_file, submission.rfq_file].filter(Boolean).length > 0
                                ? [submission.cad_file && 'CAD', submission.rfq_file && 'RFQ'].filter(Boolean).join(', ')
                                : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedSubmission(submission)}
                                className="px-4 py-2 bg-gradient-to-r from-[#08222B] to-[#0a2d3a] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEO Management Tab */}
          {activeTab === 'seo' && (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">SEO Metadata Management</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage SEO metadata for all website pages</p>
                  </div>
                  {seoData.length === 0 && (
                    <button
                      onClick={handleInitializeSEO}
                      className="px-6 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors font-medium"
                    >
                      Initialize All Pages
                    </button>
                  )}
                </div>

                {seoData.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg text-gray-600 mb-2">No SEO data found</p>
                    <p className="text-sm text-gray-500 mb-6">Initialize SEO metadata for all pages to get started</p>
                    <button
                      onClick={handleInitializeSEO}
                      className="px-8 py-3 bg-gradient-to-r from-[#08222B] to-[#0a2d3a] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      Initialize SEO Metadata
                    </button>
                    <p className="text-xs text-gray-400 mt-3">Or run `npm run init:seo` from command line</p>
                  </div>
                ) : seoView === 'grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {seoData.map((seo) => (
                      <div 
                        key={seo.id} 
                        className={`border-2 rounded-lg p-5 transition-all ${
                          editingSEO?.id === seo.id 
                            ? 'border-[#08222B] bg-blue-50' 
                            : 'border-gray-200 hover:border-[#08222B] hover:shadow-md'
                        }`}
                      >
                        {editingSEO?.id === seo.id ? (
                          <SEOEditForm
                            seo={editingSEO}
                            onSave={handleSaveSEO}
                            onCancel={() => setEditingSEO(null)}
                          />
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-[#08222B] text-white text-xs font-semibold rounded">
                                    {seo.page_path === '/' ? 'Home' : seo.page_path.replace('/', '').replace(/-/g, ' ')}
                                  </span>
                                  <a
                                    href={seo.page_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    🔗 View Page
                                  </a>
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">{seo.page_title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{seo.meta_description}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-500">Keywords:</span>
                                  <p className="text-gray-700 mt-1 line-clamp-2">{seo.meta_keywords || 'Not set'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">OG Image:</span>
                                  <p className="text-gray-700 mt-1 truncate">{seo.og_image || 'Not set'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => setEditingSEO(seo)}
                                className="flex-1 px-4 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors text-sm font-medium"
                              >
                                ✏️ Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {seoData.map((seo) => (
                      <div 
                        key={seo.id} 
                        className={`border-2 rounded-xl p-4 transition-all ${
                          editingSEO?.id === seo.id 
                            ? 'border-[#08222B] bg-blue-50' 
                            : 'border-gray-200 hover:border-[#08222B] hover:shadow-md'
                        }`}
                      >
                        {editingSEO?.id === seo.id ? (
                          <SEOEditForm
                            seo={editingSEO}
                            onSave={handleSaveSEO}
                            onCancel={() => setEditingSEO(null)}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div>
                                <span className="px-3 py-1 bg-[#08222B] text-white text-xs font-semibold rounded">
                                  {seo.page_path === '/' ? 'Home' : seo.page_path.replace('/', '').replace(/-/g, ' ')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{seo.page_title}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{seo.meta_description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>Keywords: {seo.meta_keywords?.substring(0, 50) || 'Not set'}...</span>
                                  <span>OG: {seo.og_image ? 'Set' : 'Not set'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={seo.page_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-blue-600 hover:text-blue-800 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                🔗 View
                              </a>
                              <button
                                onClick={() => setEditingSEO(seo)}
                                className="px-4 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors text-sm font-medium"
                              >
                                ✏️ Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* SMTP Settings */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">SMTP Configuration</h3>
                    <p className="text-sm text-gray-500 mt-1">Configure email server settings for sending notifications</p>
                  </div>
                </div>
                
                {smtpSettings ? (
                  <SMTPForm settings={smtpSettings} onSave={handleSaveSMTP} />
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08222B] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading SMTP settings...</p>
                  </div>
                )}
              </div>

              {/* Email Templates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Email Templates</h3>
                      <p className="text-sm text-gray-500 mt-1">Customize email templates for different form types</p>
                    </div>
                  </div>
                  {emailTemplates.length > 0 && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setEmailTemplateView('grid')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          emailTemplateView === 'grid'
                            ? 'bg-[#08222B] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Grid View"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEmailTemplateView('list')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          emailTemplateView === 'list'
                            ? 'bg-[#08222B] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        title="List View"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {emailTemplates.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <div className="text-5xl mb-4">📧</div>
                      <p className="text-lg text-gray-600 mb-2">No email templates found</p>
                      <p className="text-sm text-gray-500">Templates will be created automatically when forms are submitted</p>
                    </div>
                  ) : emailTemplateView === 'grid' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {emailTemplates.map((template) => (
                        <div 
                          key={template.id} 
                          className={`border-2 rounded-lg p-5 transition-all ${
                            editingTemplate?.id === template.id 
                              ? 'border-[#08222B] bg-blue-50' 
                              : 'border-gray-200 hover:border-[#08222B] hover:shadow-md'
                          }`}
                        >
                          {editingTemplate?.id === template.id ? (
                            <EmailTemplateForm
                              template={editingTemplate}
                              onSave={handleSaveTemplate}
                              onCancel={() => setEditingTemplate(null)}
                            />
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  template.template_type === 'admin' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {template.template_type === 'admin' ? '📨 Admin' : '✉️ Customer'}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold capitalize">
                                  {template.form_type}
                                </span>
                              </div>
                              
                              <h4 className="font-bold text-gray-900 text-lg mb-2">
                                {template.template_type === 'admin' ? 'Admin Notification' : 'Customer Confirmation'}
                              </h4>
                              
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Subject:</p>
                                <p className="text-sm text-gray-800 font-medium">{template.subject || 'No subject'}</p>
                              </div>
                              
                              <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                <div 
                                  className="text-xs text-gray-600 line-clamp-3 bg-gray-50 p-2 rounded border border-gray-200"
                                  dangerouslySetInnerHTML={{ 
                                    __html: template.body?.substring(0, 150) + '...' || 'No content' 
                                  }}
                                />
                              </div>

                              <button
                                onClick={() => setEditingTemplate(template)}
                                className="w-full px-4 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors text-sm font-medium"
                              >
                                ✏️ Edit Template
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {emailTemplates.map((template) => (
                        <div 
                          key={template.id} 
                          className={`border-2 rounded-xl p-4 transition-all ${
                            editingTemplate?.id === template.id 
                              ? 'border-[#08222B] bg-blue-50' 
                              : 'border-gray-200 hover:border-[#08222B] hover:shadow-md'
                          }`}
                        >
                          {editingTemplate?.id === template.id ? (
                            <EmailTemplateForm
                              template={editingTemplate}
                              onSave={handleSaveTemplate}
                              onCancel={() => setEditingTemplate(null)}
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    template.template_type === 'admin' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {template.template_type === 'admin' ? '📨 Admin' : '✉️ Customer'}
                                  </span>
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold capitalize">
                                    {template.form_type}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900">{template.subject || 'No subject'}</h4>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                    {template.body?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}...
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setEditingTemplate(template)}
                                className="px-4 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors text-sm font-medium"
                              >
                                ✏️ Edit
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submission Details Table View */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#08222B]">Submission Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Form Type</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {selectedSubmission.form_type}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">ID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.id}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.name || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Email</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:text-blue-800">
                          {selectedSubmission.email}
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Phone</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {selectedSubmission.phone ? (
                          <a href={`tel:${selectedSubmission.phone}`} className="text-blue-600 hover:text-blue-800">
                            {selectedSubmission.phone}
                          </a>
                        ) : 'N/A'}
                      </td>
                    </tr>
                    {selectedSubmission.organisation_name && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Organisation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.organisation_name}</td>
                      </tr>
                    )}
                    {selectedSubmission.city && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">City</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.city}</td>
                      </tr>
                    )}
                    {selectedSubmission.state && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">State</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.state}</td>
                      </tr>
                    )}
                    {selectedSubmission.message && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50 align-top">Message</td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</td>
                      </tr>
                    )}
                    {selectedSubmission.requirement && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50 align-top">Requirement</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{selectedSubmission.requirement}</td>
                      </tr>
                    )}
                    {selectedSubmission.certification_type && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Certification Type</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.certification_type}</td>
                      </tr>
                    )}
                    {selectedSubmission.estimated_volume && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Estimated Volume</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.estimated_volume}</td>
                      </tr>
                    )}
                    {selectedSubmission.order_release_date && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Order Release Date</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedSubmission.order_release_date}</td>
                      </tr>
                    )}
                    {selectedSubmission.cad_file && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">CAD File</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a 
                            href={selectedSubmission.cad_file.startsWith('/') ? selectedSubmission.cad_file : `/uploads/${selectedSubmission.cad_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {selectedSubmission.cad_file.split('/').pop() || selectedSubmission.cad_file}
                          </a>
                        </td>
                      </tr>
                    )}
                    {selectedSubmission.rfq_file && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">RFQ File</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a 
                            href={selectedSubmission.rfq_file.startsWith('/') ? selectedSubmission.rfq_file : `/uploads/${selectedSubmission.rfq_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {selectedSubmission.rfq_file.split('/').pop() || selectedSubmission.rfq_file}
                          </a>
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Submitted Date & Time</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(selectedSubmission.submitted_at)}</td>
                    </tr>
                    {selectedSubmission.ip_address && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">IP Address</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedSubmission.ip_address}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end border-t pt-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-2 bg-gradient-to-r from-[#08222B] to-[#0a2d3a] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SEO Edit Form Component
const SEOEditForm = ({ seo, onSave, onCancel }) => {
  const [formData, setFormData] = useState(seo);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Editing:</strong> {formData.page_path === '/' ? 'Home' : formData.page_path}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.page_path}
            onChange={(e) => setFormData({ ...formData, page_path: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="/page-path"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.page_title}
            onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="Page Title | Laxmi Electronics"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.meta_description || ''}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="Brief description of the page (150-160 characters recommended)"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.meta_description?.length || 0} characters
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
          <input
            type="text"
            value={formData.meta_keywords || ''}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
          <input
            type="text"
            value={formData.og_title || ''}
            onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="Open Graph Title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
          <input
            type="text"
            value={formData.og_image || ''}
            onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="/assets/images/og-image.jpg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
          <textarea
            value={formData.og_description || ''}
            onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="Open Graph description for social media sharing"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
          <input
            type="text"
            value={formData.canonical_url || ''}
            onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent"
            placeholder="https://www.laxmielectronics.com/page-path"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 px-6 py-2 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors font-medium"
        >
          💾 Save Changes
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// SMTP Settings Form Component
const SMTPForm = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    SMTP_HOST: settings.host || '',
    SMTP_PORT: settings.port || '587',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
    SMTP_FROM_EMAIL: settings.fromEmail || '',
    SMTP_FROM_NAME: 'Laxmi Electronics',
    SMTP_SECURE: 'false'
  });

  const isConfigured = !!(settings.host && settings.port);

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <div className={`p-4 rounded-lg border-2 ${
        isConfigured 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            isConfigured ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isConfigured ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <p className={`font-semibold ${
              isConfigured ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {isConfigured ? 'SMTP Configured' : 'SMTP Not Configured'}
            </p>
            <p className={`text-sm ${
              isConfigured ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {isConfigured 
                ? 'Email notifications are ready to send' 
                : 'Please configure SMTP settings to enable email notifications'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SMTP Host <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.SMTP_HOST}
            onChange={(e) => setFormData({ ...formData, SMTP_HOST: e.target.value })}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., smtp.gmail.com, smtp.outlook.com</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SMTP Port <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.SMTP_PORT}
            onChange={(e) => setFormData({ ...formData, SMTP_PORT: e.target.value })}
            placeholder="587"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Common ports: 587 (TLS), 465 (SSL), 25</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SMTP User/Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.SMTP_USER}
            onChange={(e) => setFormData({ ...formData, SMTP_USER: e.target.value })}
            placeholder="your-email@gmail.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Your email address for SMTP authentication</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SMTP Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.SMTP_PASSWORD}
            onChange={(e) => setFormData({ ...formData, SMTP_PASSWORD: e.target.value })}
            placeholder="App Password (for Gmail)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">App Password for Gmail (not regular password)</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            From Email
          </label>
          <input
            type="email"
            value={formData.SMTP_FROM_EMAIL}
            onChange={(e) => setFormData({ ...formData, SMTP_FROM_EMAIL: e.target.value })}
            placeholder="noreply@laxmielectronics.com"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Email address shown as sender</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            From Name
          </label>
          <input
            type="text"
            value={formData.SMTP_FROM_NAME}
            onChange={(e) => setFormData({ ...formData, SMTP_FROM_NAME: e.target.value })}
            placeholder="Laxmi Electronics"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Display name for sent emails</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Gmail Setup Instructions</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Enable 2-Factor Authentication in your Google Account</li>
              <li>Go to Google Account → Security → App Passwords</li>
              <li>Generate an App Password for "Mail"</li>
              <li>Use the generated 16-character password (not your regular password)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 px-6 py-3 bg-[#08222B] text-white rounded-lg hover:bg-[#0a2d3a] transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          💾 Save SMTP Settings
        </button>
      </div>
    </div>
  );
};

// Email Template Form Component
const EmailTemplateForm = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState(template);

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800 font-semibold">
          Editing: <span className="capitalize">{template.form_type}</span> - <span className="capitalize">{template.template_type}</span> Template
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.subject || ''}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          placeholder="New Form Submission - {{formType}}"
        />
        <p className="text-xs text-gray-500 mt-1">Use variables like {'{{formType}}'}, {'{{name}}'} in the subject</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Body (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.body || ''}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          rows="12"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#08222B] focus:border-transparent transition-all"
          placeholder="<html><body><h1>Hello {{name}}</h1><p>Your message: {{message}}</p></body></html>"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.body?.length || 0} characters | Use HTML format with variables
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-2">Available Variables</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{name}}'}</code>
                <span className="text-blue-800">Customer name</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{email}}'}</code>
                <span className="text-blue-800">Email address</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{phone}}'}</code>
                <span className="text-blue-800">Phone number</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{message}}'}</code>
                <span className="text-blue-800">Form message</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{formType}}'}</code>
                <span className="text-blue-800">Form type</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 bg-white rounded text-blue-700 font-mono text-xs">{'{{organisation}}'}</code>
                <span className="text-blue-800">Company name</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onSave(formData)}
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#08222B] to-[#0a2d3a] text-white rounded-lg hover:shadow-lg transition-all font-semibold shadow-md hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit & Save Template
        </button>
        <button
          onClick={onCancel}
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
