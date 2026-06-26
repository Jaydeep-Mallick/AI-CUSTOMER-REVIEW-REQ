import React, { useState } from 'react';
import toast from 'react-hot-toast';
import TestimonialForm from '../components/TestimonialForm';
import OutputCard from '../components/OutputCard';
import { generateTestimonial, submitFeedback } from '../services/api';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [currentGenerationId, setCurrentGenerationId] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setLastFormData(formData);
    try {
      // Real API call
      const response = await generateTestimonial(formData);
      
      if (response.success && response.data) {
        setGeneratedMessage(response.data.generatedMessage);
        setCurrentGenerationId(response.data.id);
        toast.success('Message generated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate message. Please try again.';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData) {
      handleGenerate(lastFormData);
    }
  };

  const handleFeedback = async (rating) => {
    if (!currentGenerationId) return;
    try {
      await submitFeedback({ generationId: currentGenerationId, rating });
      toast.success(`Feedback of ${rating} submitted!`);
    } catch (error) {
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Testimonial Request</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to generate a personalized Google review request.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TestimonialForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-1">
          {generatedMessage ? (
            <OutputCard 
              generatedMessage={generatedMessage} 
              onRegenerate={handleRegenerate}
              onFeedback={handleFeedback}
              isLoading={isLoading}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center text-gray-400">
              <span className="text-4xl mb-4">✨</span>
              <p>Generated message will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
