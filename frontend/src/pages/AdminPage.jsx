import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const AdminPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(ShopContext);

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      navigate('/login');
      return;
    }      // If authenticated, redirect to the admin application running on port 5174
    window.location.href = 'http://localhost:5174/';
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">Redirecting to Admin Panel</h2>
      <p>Please wait, you are being redirected to the admin panel...</p>
      <div className="mt-4 w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default AdminPage;
