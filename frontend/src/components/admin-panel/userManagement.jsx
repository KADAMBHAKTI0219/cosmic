import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaSearch, FaUserPlus, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { getAllUsers, updateUser, deleteUser, getUserById } from '../../services/api';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Customer', status: 'Active' });
  const [editUser, setEditUser] = useState({ id: null, name: '', email: '', role: '', status: '', joinDate: '' });
  
  // API से यूजर्स लोड करना
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (user) => {
    try {
      const response = await getUserById(user._id);
      setEditUser(response.data);
      setShowEditModal(true);
    } catch (err) {
      toast.error('Failed to load user details');
      console.error('Error fetching user details:', err);
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(editUser._id, editUser);
      
      // API से यूजर्स को फिर से लोड करना
      const response = await getAllUsers();
      setUsers(response.data);
      
      toast.success('User updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error('Failed to update user');
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        
        // API से यूजर्स को फिर से लोड करना
        const response = await getAllUsers();
        setUsers(response.data);
        
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleAddUser = async () => {
    try {
      // API कॉल यहां जोड़ें - बैकएंड में यूजर क्रिएट करने के लिए
      // await createUser(newUser);
      
      // API से यूजर्स को फिर से लोड करना
      const response = await getAllUsers();
      setUsers(response.data);
      
      toast.success('User added successfully');
      setNewUser({ name: '', email: '', password: '', role: 'Customer', status: 'Active' });
      setShowAddModal(false);
    } catch (err) {
      toast.error('Failed to add user');
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaUserPlus className="mr-2" /> Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => handleEditClick(user)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New User</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleAddUser}
              >
                <FaSave className="mr-2" /> Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editUser.name}
                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editUser.role}
                onChange={(e) => setEditUser({...editUser, role: e.target.value})}
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editUser.status}
                onChange={(e) => setEditUser({...editUser, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Join Date</label>
              <input
                type="date"
                className="border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#92c51b]"
                value={editUser.joinDate}
                onChange={(e) => setEditUser({...editUser, joinDate: e.target.value})}
                readOnly
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#92c51b] hover:bg-[#7ba515] text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleEditUser}
              >
                <FaSave className="mr-2" /> Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;