export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface FormErrors {
  [key: string]: string
}

export function useAuthForm() {
  const errors = ref<FormErrors>({})

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validateRegister(form: RegisterForm): boolean {
    errors.value = {}

    if (!form.name.trim()) {
      errors.value.name = 'Le nom est requis.'
    } else if (form.name.trim().length < 2) {
      errors.value.name = 'Le nom doit contenir au moins 2 caractères.'
    }

    if (!form.email.trim()) {
      errors.value.email = 'L\'adresse email est requise.'
    } else if (!validateEmail(form.email)) {
      errors.value.email = 'L\'adresse email n\'est pas valide.'
    }

    if (!form.password) {
      errors.value.password = 'Le mot de passe est requis.'
    } else if (form.password.length < 6) {
      errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères.'
    }

    if (!form.confirmPassword) {
      errors.value.confirmPassword = 'La confirmation du mot de passe est requise.'
    } else if (form.password !== form.confirmPassword) {
      errors.value.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    return Object.keys(errors.value).length === 0
  }

  function validateLogin(form: LoginForm): boolean {
    errors.value = {}

    if (!form.email.trim()) {
      errors.value.email = 'L\'adresse email est requise.'
    } else if (!validateEmail(form.email)) {
      errors.value.email = 'L\'adresse email n\'est pas valide.'
    }

    if (!form.password) {
      errors.value.password = 'Le mot de passe est requis.'
    }

    return Object.keys(errors.value).length === 0
  }

  function clearError(field: string) {
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  return {
    errors,
    validateRegister,
    validateLogin,
    clearError
  }
}
