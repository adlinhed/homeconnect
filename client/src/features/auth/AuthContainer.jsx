import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import HomeConnectLogo from '@/assets/homeconnect-logo.png';
import LoginForm from '@/features/auth/components/LoginForm'; // Import LoginForm
import RegisterForm from '@/features/auth/components/RegisterForm'; // Import RegisterForm
import OTPForm from '@/features/auth/components/OTPForm'; // Import OTPForm
import ForgotPassword from '@/features/auth/components/ForgotPassword'; // Import ForgotPassword
import { Link, useNavigate } from 'react-router-dom';
import { updatePageTitle } from '@/lib/utils';

function AuthContainer({ mode }) {
	const [hasMounted, setHasMounted] = useState(false);
	const [currentMode, setCurrentMode] = useState(mode); // Track current mode
	const [isTransitioning, setIsTransitioning] = useState(false); // Track transition state
	const [isOTPVerified, setIsOTPVerified] = useState(false); // Track OTP verification status
	const [registrationStep, setRegistrationStep] = useState(1); // Track registration step
	const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // Track forgot-password step
	const [isPasswordChanged, setIsPasswordChanged] = useState(false); // Track if password has been changed successfully
	const navigate = useNavigate(); // For navigation

	// Update currentMode with smooth transition
	useEffect(() => {
		// Prevent transition on first render, but allow after mount
		if (!hasMounted) {
			setCurrentMode(mode);
			setHasMounted(true);
			return;
		}
		setIsTransitioning(true); // Start transition
		setTimeout(() => {
			setCurrentMode(mode); // Update mode after transition
			setIsTransitioning(false); // End transition
		}, 150); // Match with transition duration
	}, [mode]);

	// Function to navigate back to login
	const handleBackToLogin = () => {
		navigate('/login'); // Redirect to login page
	};

	useEffect(() => {
		// Set title based on current mode and steps
		if (currentMode === 'login') {
			updatePageTitle('Login');
		} else if (currentMode === 'register') {
			updatePageTitle(registrationStep === 1 ? 'Register' : 'Verify Email');
		} else if (currentMode === 'forgot-password') {
			const titles = {
				1: 'Forgot Password',
				2: 'Verify Email',
				3: 'Reset Password',
			};
			updatePageTitle(titles[forgotPasswordStep]);
		}
	}, [currentMode, registrationStep, forgotPasswordStep]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gradient-to-br from-white to-sky-100 px-4 sm:px-6 md:px-8">
			{/* HomeConnect Logo */}
			<Link to="/">
				<img
					src={HomeConnectLogo}
					alt="HomeConnect Logo"
					className="absolute top-6 left-7 w-48 h-12 object-contain"
				/>
			</Link>
			{/* Card Container */}
			<Card className="w-full max-w-md shadow-lg bg-white">
				{!isOTPVerified && !isPasswordChanged ? (
					<CardHeader className="text-center">
						{/* Conditional Rendering of Title and Subtitle */}
						<CardTitle className="text-xl font-bold text-gray-800">
							{currentMode === 'login'
								? 'Welcome to HomeConnect'
								: currentMode === 'register'
								? registrationStep === 1
									? 'Create an Account'
									: 'Verify your Email'
								: currentMode === 'forgot-password' && forgotPasswordStep === 1
								? 'Forgot Password'
								: currentMode === 'forgot-password' && forgotPasswordStep === 2
								? 'Verify Your Email'
								: currentMode === 'forgot-password' && forgotPasswordStep === 3
								? 'Reset Your Password'
								: 'Verify Your Email'}
						</CardTitle>
						<p className="text-sm text-gray-600">
							{currentMode === 'login'
								? 'Your personalized home management solution.'
								: currentMode === 'register'
								? registrationStep === 1
									? 'Join us and start managing your home today.'
									: 'Please enter the 6-digit code sent to your email.'
								: currentMode === 'forgot-password' && forgotPasswordStep === 1
								? 'Enter your email to reset your password.'
								: currentMode === 'forgot-password' && forgotPasswordStep === 2
								? 'Please enter the 6-digit code we sent to your email to verify your identity.'
								: currentMode === 'forgot-password' && forgotPasswordStep === 3
								? 'Create a new password for your account.'
								: 'Please enter the 6-digit code sent to your email.'}
						</p>
					</CardHeader>
				) : (
					<div className="h-6"></div> // White space above Lottie icon
				)}
				<CardContent>
					{/* Smooth Transition Container */}
					<div
						className={`transition-opacity duration-300 ${
							isTransitioning ? 'opacity-0' : 'opacity-100'
						}`}
					>
						{currentMode === 'login' ? (
							<LoginForm />
						) : currentMode === 'register' ? (
							registrationStep === 1 ? (
								<RegisterForm
									onRegisterSuccess={() => setRegistrationStep(2)}
								/>
							) : (
								<OTPForm
									mode="verify"
									onVerificationSuccess={() => {
										setIsOTPVerified(true);
									}}
								/>
							)
						) : currentMode === 'forgot-password' ? (
							<ForgotPassword
								onBackToLogin={handleBackToLogin}
								onOTPSent={() => setForgotPasswordStep(2)} // Update step to OTP verification
								forgotPasswordStep={forgotPasswordStep} // Pass forgotPasswordStep
								setForgotPasswordStep={setForgotPasswordStep} // Pass setForgotPasswordStep
								onPasswordChangeSuccess={() => setIsPasswordChanged(true)} // Render successful animation on successful password change
							/>
						) : null}
					</div>
				</CardContent>
				{currentMode !== 'verify' &&
					!isOTPVerified &&
					!isPasswordChanged &&
					!(currentMode === 'register' && registrationStep === 2) && (
						<CardFooter className="flex flex-col space-y-2">
							{/* Switch Between Login and Register */}
							<div className="text-center text-xs text-gray-600">
								{currentMode === 'login' ? (
									<>
										Don't have an account?{' '}
										<Link
											to="/register"
											className="text-blue-500 hover:underline cursor-pointer"
										>
											Register here
										</Link>
									</>
								) : currentMode === 'register' && registrationStep === 1 ? (
									<>
										Already have an account?{' '}
										<Link
											to="/login"
											className="text-blue-500 hover:underline cursor-pointer"
										>
											Login here
										</Link>
									</>
								) : null}
							</div>
						</CardFooter>
					)}
			</Card>
		</div>
	);
}

export default AuthContainer;
