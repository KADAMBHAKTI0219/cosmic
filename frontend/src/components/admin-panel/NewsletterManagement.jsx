import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    content: '',
    sendToAll: true,
    selectedSubscribers: []
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/newsletter/subscribers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch newsletter subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailContent({
      ...emailContent,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setEmailContent({
      ...emailContent,
      sendToAll: checked,
      selectedSubscribers: checked ? [] : emailContent.selectedSubscribers
    });
  };

  const handleSubscriberSelection = (e, subscriberId) => {
    const { checked } = e.target;
    if (checked) {
      setEmailContent({
        ...emailContent,
        selectedSubscribers: [...emailContent.selectedSubscribers, subscriberId]
      });
    } else {
      setEmailContent({
        ...emailContent,
        selectedSubscribers: emailContent.selectedSubscribers.filter(id => id !== subscriberId)
      });
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!emailContent.subject || !emailContent.content) {
      toast.error('Please provide both subject and content for the newsletter');
      return;
    }

    if (!emailContent.sendToAll && emailContent.selectedSubscribers.length === 0) {
      toast.error('Please select at least one subscriber or choose "Send to All"');
      return;
    }

    setSendingEmail(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/newsletter/send', {
        subject: emailContent.subject,
        content: emailContent.content,
        recipients: emailContent.sendToAll ? 'all' : emailContent.selectedSubscribers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Newsletter sent successfully');
      setEmailContent({
        subject: '',
        content: '',
        sendToAll: true,
        selectedSubscribers: []
      });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error(error.response?.data?.message || 'Failed to send newsletter');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/newsletter/subscribers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Subscriber removed successfully');
        fetchSubscribers();
      } catch (error) {
        console.error('Error removing subscriber:', error);
        toast.error('Failed to remove subscriber');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Newsletter Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Send Newsletter</h2>
          <form onSubmit={handleSendNewsletter}>
            <div className="mb-4">
              <label className="block mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={emailContent.subject}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">Content</label>
              <textarea
                name="content"
                value={emailContent.content}
                onChange={handleInputChange}
                className="w-full p-2 border rounded h-40"
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emailContent.sendToAll}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Send to all subscribers
              </label>
            </div>
            
            {!emailContent.sendToAll && !loading && (
              <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
                <p className="font-semibold mb-2">Select subscribers:</p>
                {subscribers.map(subscriber => (
                  <div key={subscriber._id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={emailContent.selectedSubscribers.includes(subscriber._id)}
                      onChange={(e) => handleSubscriberSelection(e, subscriber._id)}
                      className="mr-2"
                    />
                    <span>{subscriber.email}</span>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={sendingEmail}
            >
              {sendingEmail ? 'Sending...' : 'Send Newsletter'}
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Subscribers</h2>
          
          {loading ? (
            <p>Loading subscribers...</p>
          ) : subscribers.length === 0 ? (
            <p>No subscribers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Subscribed On</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{subscriber.email}</td>
                      <td className="py-2 px-4">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterManagement;