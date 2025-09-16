 'use client';
 import React, { useState } from 'react';
 import { useRouter } from 'next/navigation';



const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = '';
    if (password.length < 6) {
      strength = 'Low';
    } else if (password.length < 10) {
      strength = 'Medium';
    } else {
      strength = 'High';
    }
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsSubmitting(true);
      setSubmitMessage('');
      try {
        // Check if email exists
        const emailCheckResponse = await fetch('http://localhost:5000/api/users/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const emailCheckData = await emailCheckResponse.json();

        if (emailCheckData.exists) {
          setSubmitMessage('Email already exists. Redirecting to login...');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // Create user
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          setSubmitMessage('Signup successful!');
          setName('');
          setEmail('');
          setPassword('');
        } else {
          const errorData = await response.json();
          setSubmitMessage(errorData.message || 'An error occurred.');
        }
      } catch (error) {
        setSubmitMessage('An error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name && 'border-red-500'}`}
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email && 'border-red-500'}`}
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password && 'border-red-500'}`}
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
            {passwordStrength && (
              <p
                className={`text-sm ${
                  passwordStrength === 'Low'
                    ? 'text-red-500'
                    : passwordStrength === 'Medium'
                    ? 'text-orange-500'
                    : 'text-green-500'
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          {submitMessage && <p className="text-sm text-center mt-4">{submitMessage}</p>}
        </form>
      </div>
    </div>
  );
};



export default SignupPage;
