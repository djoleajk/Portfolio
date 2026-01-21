import { useState } from 'react';
import useFormValidation from '../hooks/useFormValidation';

export default function ContactForm() {
  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    handleChange
  } = useFormValidation();

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Ovde bi išla implementacija slanja emaila
      // Na primer, preko API rute u Next.js
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Vaša poruka je uspešno poslata. Kontaktiraćemo vas uskoro.'
        });
        e.target.reset();
      } else {
        throw new Error('Greška pri slanju poruke');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Došlo je do greške pri slanju poruke. Molimo pokušajte ponovo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="ime" className="form-label">Vaše ime</label>
        <input
          type="text"
          className={`form-control ${errors.ime ? 'is-invalid' : ''}`}
          id="ime"
          name="ime"
          value={formData.ime}
          onChange={handleChange}
          required
        />
        {errors.ime && <div className="invalid-feedback">{errors.ime}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email adresa</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="usluga" className="form-label">Izaberite uslugu</label>
        <select
          className={`form-select ${errors.usluga ? 'is-invalid' : ''}`}
          id="usluga"
          name="usluga"
          value={formData.usluga}
          onChange={handleChange}
          required
        >
          <option value="">Izaberite uslugu</option>
          <option value="seo">SEO Optimizacija</option>
          <option value="ppc">PPC Kampanje</option>
          <option value="social">Društvene Mreže</option>
          <option value="web">Web Development</option>
        </select>
        {errors.usluga && <div className="invalid-feedback">{errors.usluga}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="poruka" className="form-label">Vaša poruka</label>
        <textarea
          className={`form-control ${errors.poruka ? 'is-invalid' : ''}`}
          id="poruka"
          name="poruka"
          rows="5"
          value={formData.poruka}
          onChange={handleChange}
          required
        ></textarea>
        {errors.poruka && <div className="invalid-feedback">{errors.poruka}</div>}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Slanje...
          </>
        ) : 'Pošaljite poruku'}
      </button>

      {submitStatus && (
        <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} mt-3`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
} 