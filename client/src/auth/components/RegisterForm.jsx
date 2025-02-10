import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { userRegistrationStore } from '@/store/userRegistration';

function RegisterForm() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [registerError, setRegisterError] = useState('');

	// Track focus state for input fields
	const [isUsernameFocused, setIsUsernameFocused] = useState(false);
	const [isEmailFocused, setIsEmailFocused] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

	// Setup redirect
	const navigate = useNavigate();

	// Initialise zustand store modification methods
	const {
		setUsername: setUsernameStore,
		setEmail: setEmailStore,
		setPassword: setPasswordStore,
	} = userRegistrationStore();

	// Form Validation
	const validateForm = () => {
		const newErrors = {};

		// Validate Username
		if (!username) {
			newErrors.username = 'Username is required';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		}

		// Validate Email
		if (!email) {
			newErrors.email = 'Email is required';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		}

		// Validate Password
		if (!password) {
			newErrors.password = 'Password is required';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters long';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		}

		// Validate Confirm Password
		if (!confirmPassword) {
			newErrors.confirmPassword = 'Confirm Password is required';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			setErrors(newErrors); // Update errors state
			return false; // Stop further validation
		}

		setErrors(newErrors); // Update errors state
		return Object.keys(newErrors).length === 0; // Return true if no errors
	};

	// Call otp mailing api
	const sendOTP = async (e) =>{
		console.log('email submitted:', email);
		
		// Send OTP to user
		const response = await fetch('server/users/sendOTP', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		});

		if(!response.ok) {
			throw new Error('Invalid email entered!');
		}

		//alert('OTP sent to your email!'); otp sent animation or whatever
	}

	// Handle Registration
	const handleRegister = async (e) => {
		e.preventDefault();

		// Clear previous errors
		setErrors({});
		setRegisterError('');

		// Validate Form
		if (!validateForm()) return;

		// Auth logic here
		try {
			console.log('Registering with:', { username, email, password });

			// Store user data in zustand store
			setUsernameStore(username);
			setEmailStore(email);
			setPasswordStore(password);

			// Send otp and redirect user after valid details entered
			console.log('Registration details entered, attempting to send OTP to user');
			try {
				sendOTP();
				console.log('OTP sent succesfully! Redirecting to otp verification')
			} catch (err) {
				return alert(err.message || 'Invalid email entered!');
			}

			navigate('/verify'); // Redirect to otp verification

		} catch (error) {
			setRegisterError(
				error.message || 'An error occurred during registration'
			);
		}
	};

	return (
		<form onSubmit={handleRegister} noValidate className="space-y-3">
			{/* Username Field */}
			<div className="space-y-1">
				<div className="flex items-center space-x-1">
					<Label htmlFor="username" className="text-sm">
						Username
					</Label>
					<span className="text-red-500">*</span>
					{errors.username && (
						<span className="text-red-500 text-xs ml-auto">
							- {errors.username}
						</span>
					)}
				</div>
				<Input
					id="username"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					onFocus={() => setIsUsernameFocused(true)}
					onBlur={() => setIsUsernameFocused(false)}
					required
					className={`w-full border border-gray-300 focus:border-black focus-visible:ring-0 focus:outline-none transition-colors duration-150 ${
						errors.username && !isUsernameFocused ? 'border-red-500' : ''
					}`}
				/>
			</div>

			{/* Email Field */}
			<div className="space-y-1">
				<div className="flex items-center space-x-1">
					<Label htmlFor="email" className="text-sm">
						Email
					</Label>
					<span className="text-red-500">*</span>
					{errors.email && (
						<span className="text-red-500 text-xs ml-auto">
							- {errors.email}
						</span>
					)}
				</div>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					onFocus={() => setIsEmailFocused(true)}
					onBlur={() => setIsEmailFocused(false)}
					required
					className={`w-full border border-gray-300 focus:border-black focus-visible:ring-0 focus:outline-none transition-colors duration-150 ${
						errors.email && !isEmailFocused ? 'border-red-500' : ''
					}`}
				/>
			</div>

			{/* Password Field */}
			<div className="space-y-1">
				<div className="flex items-center space-x-1">
					<Label htmlFor="password" className="text-sm">
						Password
					</Label>
					<span className="text-red-500">*</span>
					{errors.password && (
						<span className="text-red-500 text-xs ml-auto">
							- {errors.password}
						</span>
					)}
				</div>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onFocus={() => setIsPasswordFocused(true)}
						onBlur={() => setIsPasswordFocused(false)}
						required
						className={`h-9 pr-10 border border-gray-300 focus:border-black focus-visible:ring-0 focus:outline-none transition-colors duration-150 ${
							errors.password && !isPasswordFocused ? 'border-red-500' : ''
						}`}
					/>
					{/* Eye Icon */}
					<button
						type="button"
						className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
					</button>
				</div>
			</div>

			{/* Confirm Password Field */}
			<div className="space-y-1">
				<div className="flex items-center space-x-1">
					<Label htmlFor="confirmPassword" className="text-sm">
						Confirm Password
					</Label>
					<span className="text-red-500">*</span>
					{errors.confirmPassword && (
						<span className="text-red-500 text-xs ml-auto">
							- {errors.confirmPassword}
						</span>
					)}
				</div>
				<div className="relative">
					<Input
						id="confirmPassword"
						type={showConfirmPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						onFocus={() => setIsConfirmPasswordFocused(true)}
						onBlur={() => setIsConfirmPasswordFocused(false)}
						required
						className={`h-9 pr-10 border border-gray-300 focus:border-black focus-visible:ring-0 focus:outline-none transition-colors duration-150 ${
							errors.confirmPassword && !isConfirmPasswordFocused
								? 'border-red-500'
								: ''
						}`}
					/>
					{/* Eye Icon */}
					<button
						type="button"
						className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
					>
						{showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
					</button>
				</div>
			</div>

			{/* Registration Error Message */}
			{registerError && (
				<p className="text-red-500 text-xs text-center">{registerError}</p>
			)}

			{/* Register Button */}
			<Button type="submit" className="w-full h-9 text-sm">
				Register
			</Button>
		</form>
	);
}

export default RegisterForm;
