import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { CATEGORY_LABEL_MAP } from '../components/MultiLanguageBlogEditor';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar,
  User,
  Users,
  BarChart3,
  LogOut,
  AlertCircle,
  RefreshCw,
  KeyRound,
  CheckCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const BlogManagement = () => {
  const { user, logout, hasPermission, authFetch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, archived: 0 });

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to change password.');
      setPwSuccess('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/blog/stats`);
      const data = await res.json();
      if (res.ok && data.success) setStats(data.data);
    } catch (_) {
      // stats are non-critical — silently ignore
    }
  }, [authFetch]);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: pagination.limit, page: pagination.page });
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await authFetch(`${API_BASE}/api/blog/posts?${params}`);
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load posts.');

      setPosts(data.data);
      setPagination((p) => ({ ...p, total: data.pagination.total }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, statusFilter, pagination.limit, pagination.page]);

  // Re-fetch posts when filter or page changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Re-fetch stats on every navigation to this page (covers navigate-back from editor)
  // and on initial mount
  useEffect(() => {
    fetchStats();
  }, [location.key, fetchStats]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await authFetch(`${API_BASE}/api/blog/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed.');
      setSelectedPosts((prev) => prev.filter((id) => id !== postId));
      await Promise.all([fetchPosts(), fetchStats()]);
      toast.success('Post deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete post.');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPosts.length === 0) return;
    if (action === 'delete') {
      if (!window.confirm(`Delete ${selectedPosts.length} post(s)?`)) return;
      await Promise.all(selectedPosts.map((id) =>
        authFetch(`${API_BASE}/api/blog/posts/${id}`, { method: 'DELETE' })
      ));
      await Promise.all([fetchPosts(), fetchStats()]);
      setSelectedPosts([]);
    } else {
      const status = action === 'publish' ? 'published' : 'draft';
      await Promise.all(selectedPosts.map((id) =>
        authFetch(`${API_BASE}/api/blog/posts/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        })
      ));
      await Promise.all([fetchPosts(), fetchStats()]);
      setSelectedPosts([]);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const title = post.content?.en?.title || '';
    const excerpt = post.content?.en?.excerpt || '';
    const authorName = post.author?.name || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // stats comes from the dedicated /api/blog/stats endpoint — always globally accurate
  // (not derived from the local page array which only holds the current page)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img src="/assets/images/logo.png" alt="InSite Health" className="h-8" />
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Blog Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                <Eye className="h-5 w-5" />
              </Link>
              {hasPermission('admin') && (
                <Link to="/blog/manage/users" className="text-gray-600 hover:text-insite-blue transition-colors" title="Manage Users">
                  <Users className="h-5 w-5" />
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || '/assets/images/team-1.jpg'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">{user?.name}</span>
                <button onClick={logout} className="text-gray-600 hover:text-gray-900 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
                <button
                  onClick={() => { setShowChangePassword((v) => !v); setPwError(''); setPwSuccess(''); }}
                  className="text-gray-600 hover:text-insite-blue transition-colors"
                  title="Change Password"
                >
                  <KeyRound className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Posts', value: stats.total, icon: BarChart3, color: 'blue' },
            { label: 'Published', value: stats.published, icon: Eye, color: 'green' },
            { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'yellow' },
            { label: 'Archived', value: stats.archived, icon: Calendar, color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 bg-${color}-100 rounded-lg`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Link
                  to="/blog/manage/new"
                  className="bg-insite-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-insite-blue/90 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
                <button
                  onClick={() => { fetchPosts(); fetchStats(); }}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>

                {selectedPosts.length > 0 && (
                  <div className="flex items-center gap-2 bg-insite-blue/10 border border-insite-blue/30 rounded-lg px-3 py-2">
                    <span className="text-sm font-medium text-insite-blue">
                      {selectedPosts.length} selected
                    </span>
                    <div className="w-px h-4 bg-insite-blue/30" />
                    <select
                      onChange={(e) => { if (e.target.value) handleBulkAction(e.target.value); e.target.value = ''; }}
                      defaultValue=""
                      className="text-sm border border-insite-blue/40 bg-white text-gray-700 rounded px-2 py-1 focus:ring-2 focus:ring-insite-blue focus:border-transparent cursor-pointer"
                    >
                      <option value="" disabled>Bulk Actions</option>
                      {hasPermission('editor') && <option value="publish">Publish</option>}
                      {hasPermission('editor') && <option value="draft">Move to Draft</option>}
                      {hasPermission('admin') && <option value="delete">Delete</option>}
                    </select>
                    <button
                      type="button"
                      onClick={() => setSelectedPosts([])}
                      className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
              <button onClick={() => { fetchPosts(); fetchStats(); }} className="ml-auto text-sm underline">Retry</button>
            </div>
          )}

          {/* Loading */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-insite-blue" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-4 p-4">
                      <input
                        type="checkbox"
                        onChange={(e) => setSelectedPosts(e.target.checked ? filteredPosts.map((p) => p._id) : [])}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Title</th>
                    <th className="text-left p-4 font-medium text-gray-900">Author</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">Views</th>
                    <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post._id)}
                          onChange={(e) =>
                            setSelectedPosts((prev) =>
                              e.target.checked ? [...prev, post._id] : prev.filter((id) => id !== post._id)
                            )
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-start space-x-3">
                          {post.featuredImage?.url && (
                            <img
                              src={post.featuredImage.url}
                              alt={post.content?.en?.title}
                              className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{post.content?.en?.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{post.content?.en?.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(post.categories || []).map((cat, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {CATEGORY_LABEL_MAP[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{post.author?.name || '—'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Modified: {formatDate(post.updatedAt)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{post.views || 0}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/blog/manage/edit/${post._id}`}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          {hasPermission('editor') && (
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPosts.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || statusFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first blog post'}
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <Link
                      to="/blog/manage/new"
                      className="inline-flex items-center bg-insite-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-insite-blue/90 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Post
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Change Password Panel */}
        {showChangePassword && (
          <div className="bg-white rounded-lg shadow mt-8 p-6 max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-insite-blue" />
              Change Password
            </h2>

            {pwError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{pwError}</span>
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{pwSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-insite-blue focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-insite-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-insite-blue/90 transition-colors disabled:opacity-50"
                >
                  {pwLoading ? 'Saving...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowChangePassword(false); setPwError(''); setPwSuccess(''); }}
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
