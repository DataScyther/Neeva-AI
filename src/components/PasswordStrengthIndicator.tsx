import React, { useEffect, useRef } from 'react';
import { Shield, Check, X, AlertCircle } from 'lucide-react';
import { PasswordValidationResult } from '../utils/validation';
import '../styles/password-strength.css';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult | null;
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  validation,
  password
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  if (!password || !validation) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-strong':
        return 'bg-green-500';
      case 'strong':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'weak':
      default:
        return 'bg-red-500';
    }
  };

  const getStrengthTextColor = (strength: string) => {
    switch (strength) {
      case 'very-strong':
        return 'text-green-600';
      case 'strong':
        return 'text-blue-600';
      case 'medium':
        return 'text-yellow-600';
      case 'weak':
      default:
        return 'text-red-600';
    }
  };

  const getStrengthMessage = (strength: string) => {
    switch (strength) {
      case 'very-strong':
        return 'Excellent password!';
      case 'strong':
        return 'Strong password';
      case 'medium':
        return 'Good, but could be stronger';
      case 'weak':
      default:
        return 'Weak password';
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (validation.score / 10) * 100);
  
  // Update progress bar width using CSS custom property
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty('--progress-width', `${progressPercentage}%`);
    }
  }, [progressPercentage]);

  // Check requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  const requirementsMet = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars]
    .filter(Boolean).length;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Password Strength</span>
          </div>
          <span className={`text-xs font-semibold ${getStrengthTextColor(validation.strength)}`}>
            {getStrengthMessage(validation.strength)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className={`password-strength-bar h-full transition-all duration-300 ${getStrengthColor(validation.strength)}`}
            data-progress={progressPercentage}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
        
        <div className="grid grid-cols-1 gap-1.5">
          <RequirementItem
            met={hasMinLength}
            text="At least 8 characters"
          />
          <RequirementItem
            met={requirementsMet >= 2}
            text="2 of 4 character types:"
          />
          <div className="ml-4 space-y-1">
            <RequirementItem
              met={hasUppercase}
              text="Uppercase letters (A-Z)"
              isSubItem
            />
            <RequirementItem
              met={hasLowercase}
              text="Lowercase letters (a-z)"
              isSubItem
            />
            <RequirementItem
              met={hasNumbers}
              text="Numbers (0-9)"
              isSubItem
            />
            <RequirementItem
              met={hasSpecialChars}
              text="Special characters (!@#$%)"
              isSubItem
            />
          </div>
        </div>

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {validation.errors.map((error, index) => (
              <div key={index} className="flex items-start gap-1.5 text-xs text-red-600 mt-1">
                <X className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {validation.isValid && validation.strength === 'very-strong' && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <Check className="w-3 h-3" />
              <span>Your password meets all security requirements!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface RequirementItemProps {
  met: boolean;
  text: string;
  isSubItem?: boolean;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text, isSubItem = false }) => {
  return (
    <div className={`flex items-center gap-1.5 ${isSubItem ? 'text-xs' : 'text-xs'}`}>
      {met ? (
        <Check className={`${isSubItem ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-green-500 flex-shrink-0`} />
      ) : (
        <div className={`${isSubItem ? 'w-3 h-3' : 'w-3.5 h-3.5'} rounded-full border border-gray-300 flex-shrink-0`} />
      )}
      <span className={met ? 'text-green-700' : 'text-gray-600'}>{text}</span>
    </div>
  );
};

export default PasswordStrengthIndicator;
