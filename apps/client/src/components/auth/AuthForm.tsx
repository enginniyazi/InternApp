import React, { useState } from 'react';
import { z } from 'zod';
import './AuthForm.css';

export type UserRole = 'STUDENT' | 'COMPANY';

// Zod Doğrulama Şemaları
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta alanı boş bırakılamaz.')
    .email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
});

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-posta alanı boş bırakılamaz.')
      .email('Geçerli bir e-posta adresi giriniz.'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır.'),
    role: z.enum(['STUDENT', 'COMPANY']),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    companyName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'STUDENT') {
      if (!data.firstName || data.firstName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ad alanı zorunludur.',
          path: ['firstName'],
        });
      }
      if (!data.lastName || data.lastName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Soyad alanı zorunludur.',
          path: ['lastName'],
        });
      }
    } else if (data.role === 'COMPANY') {
      if (!data.companyName || data.companyName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Şirket adı zorunludur.',
          path: ['companyName'],
        });
      }
    }
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  onLogin?: (data: LoginFormData) => Promise<void> | void;
  onRegister?: (data: RegisterFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, isLoading = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('STUDENT');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Validation Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              formattedErrors[issue.path[0] as string] = issue.message;
            }
          });
          setErrors(formattedErrors);
          return;
        }
        if (onLogin) {
          await onLogin(result.data);
        }
      } else {
        const result = registerSchema.safeParse({
          email,
          password,
          role,
          firstName,
          lastName,
          companyName,
        });

        if (!result.success) {
          const formattedErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            if (issue.path[0]) {
              formattedErrors[issue.path[0] as string] = issue.message;
            }
          });
          setErrors(formattedErrors);
          return;
        }
        if (onRegister) {
          await onRegister(result.data);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">StajApp Platformu</h2>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrors({});
            }}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrors({});
            }}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${role === 'STUDENT' ? 'selected' : ''}`}
                onClick={() => setRole('STUDENT')}
              >
                <span>🎓</span> Öğrenci
              </button>
              <button
                type="button"
                className={`role-option ${role === 'COMPANY' ? 'selected' : ''}`}
                onClick={() => setRole('COMPANY')}
              >
                <span>🏢</span> Şirket
              </button>
            </div>
          )}

          {mode === 'register' && role === 'STUDENT' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  Ad
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                  placeholder="Ahmet"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Soyad
                </label>
                <input
                  id="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                  placeholder="Yılmaz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
          )}

          {mode === 'register' && role === 'COMPANY' && (
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">
                Şirket Adı
              </label>
              <input
                id="companyName"
                type="text"
                className={`form-input ${errors.companyName ? 'has-error' : ''}`}
                placeholder="Teknoloji A.Ş."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              placeholder="ornek@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'has-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading || isSubmitting}>
            {isLoading || isSubmitting
              ? 'İşlem yapılıyor...'
              : mode === 'login'
                ? 'Giriş Yap'
                : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  );
};
