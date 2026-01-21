import { useState } from 'react';

export default function useFormValidation() {
  const [formData, setFormData] = useState({
    ime: '',
    email: '',
    usluga: '',
    poruka: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.ime.length < 2) {
      newErrors.ime = 'Ime mora imati najmanje 2 karaktera';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Unesite validnu email adresu';
    }

    if (!formData.usluga) {
      newErrors.usluga = 'Molimo izaberite uslugu';
    }

    if (formData.poruka.length < 10) {
      newErrors.poruka = 'Poruka mora imati najmanje 10 karaktera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Očisti grešku za ovo polje ako postoji
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleChange
  };
} 