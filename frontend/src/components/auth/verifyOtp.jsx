import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { verifyOtp, resendOtp } from '../../services/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      toast.error('ईमेल नहीं मिला, कृपया फिर से प्रयास करें');
      navigate('/auth/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('कृपया OTP दर्ज करें');
      return;
    }
    
    try {
      setLoading(true);
      await verifyOtp({ email, otp });
      toast.success('OTP सफलतापूर्वक वेरिफाई हो गया');
      navigate('/auth/reset-password', { state: { email, otp } });
    } catch (error) {
      console.error('OTP वेरिफिकेशन में त्रुटि:', error);
      toast.error(error.response?.data?.message || 'गलत OTP, कृपया फिर से प्रयास करें');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60);
      await resendOtp(email);
      toast.success('नया OTP आपके ईमेल पर भेज दिया गया है');
    } catch (error) {
      console.error('OTP रीसेंड में त्रुटि:', error);
      toast.error(error.response?.data?.message || 'OTP रीसेंड में त्रुटि हुई');
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            OTP वेरिफिकेशन
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {email} पर भेजा गया OTP दर्ज करें
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="OTP दर्ज करें"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  वेरिफाई हो रहा है...
                </span>
              ) : (
                'वेरिफाई करें'
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`font-medium ${
                resendDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-600 hover:text-indigo-500'
              }`}
            >
              {resendDisabled
                ? `OTP फिर से भेजें (${countdown}s)`
                : 'OTP फिर से भेजें'}
            </button>
            <div className="text-sm">
              <Link to="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                वापस जाएं
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;