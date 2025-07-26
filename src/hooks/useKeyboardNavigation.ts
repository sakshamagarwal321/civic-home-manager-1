
import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

export const useKeyboardNavigation = ({
  isOpen,
  onClose,
  onSubmit,
  returnFocusRef,
}: UseKeyboardNavigationProps) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            onClose();
            break;
          case 'Enter':
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              onSubmit?.();
            }
            break;
          case 'Tab':
            // Trap focus within modal/dialog
            trapFocus(event);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose, onSubmit]);

  // Return focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      const elementToFocus = returnFocusRef?.current || previousFocusRef.current;
      elementToFocus.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen, returnFocusRef]);

  const trapFocus = (event: KeyboardEvent) => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return {
    previousFocusRef,
  };
};
