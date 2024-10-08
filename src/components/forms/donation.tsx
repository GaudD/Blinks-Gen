'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function DonationForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        description: '',
        label: '',
        addy: '',
        amount1: '',
        amount2: '',
        amount3: ''
    });

    const { publicKey, connected } = useWallet();

    useEffect(() => {
        if (publicKey) {
            setFormData((prevData) => ({
                ...prevData,
                addy: publicKey.toString()
            }));
        }
    }, [publicKey]);


    const [errors, setErrors] = useState({
        title: '',
        imgUrl: '',
        description: '',
        label: '',
        amount1: '',
        amount2: '',
        amount3: ''
    });

    // Functions to validate the form data
    const validateStep1 = () => {
        const newErrors = { title: '', imgUrl: '', description: '', label: '' };
        let isValid = true;
    
        // Title validation
        if (!formData.title) {
            newErrors.title = 'Title is required.';
            isValid = false;
        }
    
        // Image URL validation
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/; // Basic URL validation
        if (!formData.imgUrl) {
            newErrors.imgUrl = 'Image URL is required.';
            isValid = false;
        } else if (!urlRegex.test(formData.imgUrl)) {
            newErrors.imgUrl = 'Please enter a valid URL.';
            isValid = false;
        }
    
        // Description validation
        if (!formData.description) {
            newErrors.description = 'Description is required.';
            isValid = false;
        }
    
        // Label validation
        if (!formData.label) {
            newErrors.label = 'Label is required.';
            isValid = false;
        }
    
        setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
        return isValid;
    };
    
    const validateStep2 = () => {
        const newErrors = { title: '', imgUrl: '', description: '', label: '', amount1: '', amount2: '', amount3: '' };
        let isValid = true;
    
        // Amounts validation
        const amounts = [Number(formData.amount1), Number(formData.amount2), Number(formData.amount3)];
        amounts.forEach((amount, index) => {
            if (isNaN(amount) || amount < 0.005) {
                const key = `amount${index + 1}` as keyof typeof newErrors; // Type assertion
                newErrors[key] = 'Amount must be greater than 0.005.';
                isValid = false;
            }
        });
    
        setErrors(newErrors);
        return isValid;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNext = () => {
        // Check if we are on the first step
        if (currentStep === 1) {
            if (validateStep1()) {
                setCurrentStep((prevStep) => prevStep + 1);
            } else {
                console.log("Step 1 validation failed.");
            }
        }
    };
    
    const handleBack = () => {
        // Simply go back to the previous step
        setCurrentStep((prevStep) => prevStep - 1);
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if we are on the second step
        if (currentStep === 2) {
            if (validateStep2()) {
                try {                    
                    const response = await axios.post('/api/upload', formData);
                    if (response.status === 200) {
                        const blinkId = response.data.id;
                        console.log('Form submitted successfully:', response.data);

                        router.push(`/generated-blink?blinkId=${blinkId}`);
                    } else {
                        console.error('Form submission failed:', response.data);
                    }
                } catch (error) {
                    console.error('An error occurred during submission:', error);
                }
            } else {
                console.log("Step 2 validation failed.");
            }
        }
    };

    return (
        <div className="flex flex-col w-[70%] p-10 mx-auto">
            <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                    <>
                        {/* Title */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Title
                            </label>
                            {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
                        </div>

                        {/* Image URL */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="imgUrl"
                                id="imgUrl"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.imgUrl}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Image URL (PNG, JPG GIF or WEBP only)
                            </label>
                            {errors.imgUrl && <p className="text-red-600 text-sm">{errors.imgUrl}</p>}
                        </div>

                        {/* Description */}
                        <div className="relative z-0 w-full mb-5 group">
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Description
                            </label>
                            {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                        </div>

                        {/* Label */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="label"
                                id="label"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.label}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Label
                            </label>
                            {errors.label && <p className="text-red-600 text-sm">{errors.label}</p>}
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        {/* Amount 1 */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="amount1"
                                id="amount1"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.amount1}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Amount 1
                            </label>
                            {errors.amount1 && <p className="text-red-600 text-sm">{errors.amount1}</p>}
                        </div>

                        {/* Amount 2 */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="amount2"
                                id="amount2"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.amount2}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Amount 2
                            </label>
                            {errors.amount2 && <p className="text-red-600 text-sm">{errors.amount2}</p>}
                        </div>

                        {/* Amount 3 */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="amount3"
                                id="amount3"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={formData.amount3}
                                onChange={handleChange}
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Amount 3
                            </label>
                            {errors.amount3 && <p className="text-red-600 text-sm">{errors.amount3}</p>}
                        </div>
                    </>
                )}
                <div className="flex justify-between">
                    {currentStep > 1 && (
                        <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">
                            Back
                        </button>
                    )}
                    {currentStep < 2 ? (
                        <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Next
                        </button>
                    ) : (
                        <>
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                                Submit
                            </button>
                            {!connected && (
                                <p className="text-red-500 mt-2">
                                    Please connect your Wallet to continue
                                </p>
                            )}
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
