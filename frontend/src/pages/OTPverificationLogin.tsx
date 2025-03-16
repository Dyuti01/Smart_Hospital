"use client"

import type React from "react"

import { useState, useRef, useEffect, useContext } from "react"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "../ui/patientProfile/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/patientProfile/card"
import { Input } from "../ui/patientProfile/input"
import { cn } from "../lib/utils"
import { Link, useNavigate } from "react-router"
import firebase from "../firebase";
import { BACKEND_URL } from "../config"
import signinContext from "../utils/signinContext"
import axios from "axios"
import { toast } from "../ui/patientProfile/use-toast"
import { AuthContext, useAuth } from "../utils/AuthContext"

export default function OTPVerificationLogin() {
	const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
	const [isVerifying, setIsVerifying] = useState(false)
	const [isVerified, setIsVerified] = useState(false)
	const [timer, setTimer] = useState(30)
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	// const [verificationCode, setVerificationCode] = useState("")

	const verificationData = useContext(signinContext)
	const auth = useAuth()

	useEffect(() => {
		// Focus first input on mount
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus()
		}
	}, [])

	useEffect(() => {
		// Countdown timer for resend code
		if (timer > 0 && !isVerified) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1)
			}, 1000)
			return () => clearInterval(interval)
		}
	}, [timer, isVerified])

	const handleChange = (element: HTMLInputElement, index: number) => {
		if (isNaN(Number(element.value))) return false

		const newOtp = [...otp]
		newOtp[index] = element.value
		setOtp(newOtp)

		// Move to next input if current field is filled
		if (element.value && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		// Move to previous input on backspace if current field is empty
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData("text/plain").slice(0, 6)

		if (/^\d+$/.test(pastedData)) {
			const newOtp = [...otp]
			pastedData.split("").forEach((value, index) => {
				if (index < 6) newOtp[index] = value
			})
			setOtp(newOtp)

			// Focus last filled input or first empty input
			const lastIndex = Math.min(pastedData.length - 1, 5)
			inputRefs.current[lastIndex]?.focus()
		}
	}

	const navigate = useNavigate()
	const handleVerify = () => {
		try {
			setIsVerifying(true)
			const verificationCode = otp.join("").toString();
			console.log(verificationCode)
			console.log(verificationData)
			const credentials = firebase.auth.PhoneAuthProvider.credential(verificationData.verificationId, verificationCode);
			console.log(credentials)
			firebase.auth().signInWithCredential(credentials).then(async (userCrdential) => {
				console.log("User logged in: " + userCrdential.user?.toJSON())
				const phoneSigninData = {
					userType: verificationData.signinFormData.userType,
					phone: verificationData.signinFormData.phone,
				}
				const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, phoneSigninData, { withCredentials: true })
				console.log("from Login", response.data)

				const { message, userId }: any = response.data;
				localStorage.setItem("userId", userId);
				auth.login(userId);

				setIsVerified(true)
				setIsVerifying(false)
				if (phoneSigninData.userType==="Patient"){
					navigate('/patient_profile')
				}
				else if (phoneSigninData.userType==="Doctor"){
					navigate("/doctor_profile")
				}
				else{
					navigate("/staff_profile")
				}
			}).catch((error: any) => {
				console.error("Error verify otp: " + error)
				toast({
					title: "Something wrong",
					description: `${error}`,
					variant: "destructive",
					duration: 3000
				})
				setIsVerifying(false)
			})
		} catch (err: any) {

			console.log(err)
			toast({
				title: "Something wrong",
				description: `${err}`,
				variant: "destructive",
				duration: 3000
			})
			setIsVerifying(false)
		}
	};

	const recaptchaRef = useRef(null)

	const sendOtp = async () => {
		try {
			if (recaptchaRef.current) {
				//@ts-ignore
				recaptchaRef.current.innerHTML = '<div id="recaptcha-container"></div>'
			}
			const verifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", { size: "invisible" })

			firebase.auth().signInWithPhoneNumber(verificationData.signinFormData.phone, verifier).then((confirmationRes) => {
				verificationData.setVerifyDataLogin({ signinFormData: verificationData.signinFormData, verificationId: confirmationRes.verificationId })
				console.log("OTP got sent")
				// navigate('/otp_verification')
				// Toast
			}).catch((error) => {
				console.log("Error sending OTP: " + error)
			})
		}
		catch (err) {

			console.error(err)
		}

	}

	const handleResend = () => {
		setTimer(30)
		// Implement resend logic here
		sendOtp()
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white relative overflow-hidden">
			{/* Background beams */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwODkxYjIiIHN0b3Atb3BhY2l0eT0iMC4xIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBkOWQ4OCIgc3RvcC1vcGFjaXR5PSIwLjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0idXJsKCNncmFkKSIvPgo8L3N2Zz4=')] opacity-40" />

			<div className="container relative mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardHeader className="space-y-3">
						<Link to={"/signin"}>
						<Button
							variant="ghost"
							size="sm"
							className="w-fit -ml-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						</Link>
						<div className="space-y-1">
							<CardTitle className="text-2xl text-cyan-900">Verify Your Identity</CardTitle>
							<CardDescription>Enter the 6-digit code sent to your phone number ending in +91xxxxxx{verificationData.signinFormData.phone.slice(8)}</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						{!isVerified ? (
							<div className="space-y-6">
								<div className="flex justify-between gap-2">
									{otp.map((digit, index) => (
										<Input
											key={index}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={digit}
											ref={(el) => (inputRefs.current[index] = el)}
											onChange={(e) => handleChange(e.target, index)}
											onKeyDown={(e) => handleKeyDown(e, index)}
											onPaste={handlePaste}
											className={cn(
												"w-12 h-12 text-center text-lg font-semibold border-gray-200",
												"focus:border-cyan-500 focus:ring-cyan-500",
												"transition-all duration-200",
											)}
										/>
									))}
								</div>

								<div className="text-center">
									{timer > 0 ? (
										<p className="text-sm text-gray-500">Resend code in {timer} seconds</p>
									) : (
										<button onClick={handleResend} className="text-sm text-cyan-600 hover:text-cyan-700">
											Resend Code
										</button>
									)}
								</div>
							</div>
						) : (
							<div className="py-6 flex flex-col items-center justify-center">
								<div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
									<CheckCircle className="h-8 w-8 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold text-green-600 mb-2">Verification Successful</h3>
								<p className="text-sm text-gray-500 text-center">Your identity has been verified successfully.</p>
							</div>
						)}
					</CardContent>
					<CardFooter>
						<Button
							className={cn(
								"w-full transition-all duration-200",
								isVerified
									? "bg-green-600 hover:bg-green-700"
									: "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
							)}
							disabled={otp.some((digit) => !digit) || isVerifying}
							onClick={() => {
								if (!isVerified) {
									handleVerify()
								}
								else if (isVerified) {
									navigate('/patient_profile')
								}
							}}
						>
							{isVerifying ? (
								<div className="flex items-center">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
									Verifying...
								</div>
							) : isVerified ? (
								"Continue to your profile"
							) : (
								"Verify Code"
							)}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

