// 'use client';

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// function ResetPasswordPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     email: '',
//     newPassword: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await axios.post('/api/users/forgotpassword', formData);
//       setMessage(response.data.message);
//       setFormData({ email: '', newPassword: '' });

//       // Optional: redirect to login after success
//       setTimeout(() => router.push('/login'), 2000);
//     } catch (error) {
//       setMessage(
//         error.response?.data?.error || 'Something went wrong. Try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Reset Your Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
//             />
//           </div>

//           {/* New Password Field */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               New Password
//             </label>
//             <input
//               type="password"
//               name="newPassword"
//               value={formData.newPassword}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
//           >
//             {loading ? 'Updating...' : 'Reset Password'}
//           </button>
//         </form>

//         {message && (
//           <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ResetPasswordPage;
