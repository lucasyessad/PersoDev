import type { Agency } from '@/types/database';

export interface CompletenessResult {
  score: number; // 0-100
  completed: string[];
  missing: string[];
  suggestions: string[];
}

interface CheckItem {
  field: keyof Agency;
  label: string;
  weight: number;
  suggestion: string;
}

const CHECKS: CheckItem[] = [
  { field: 'name', label: 'Nom de l\'agence', weight: 10, suggestion: 'Ajoutez le nom de votre agence' },
  { field: 'description', label: 'Description', weight: 10, suggestion: 'Rédigez une description de votre agence (min. 100 caractères)' },
  { field: 'phone', label: 'Téléphone', weight: 10, suggestion: 'Ajoutez votre numéro de téléphone' },
  { field: 'email', label: 'Email', weight: 10, suggestion: 'Ajoutez votre adresse email professionnelle' },
  { field: 'address', label: 'Adresse', weight: 8, suggestion: 'Ajoutez l\'adresse de votre agence' },
  { field: 'wilaya', label: 'Wilaya', weight: 8, suggestion: 'Indiquez votre wilaya' },
  { field: 'logo_url', label: 'Logo', weight: 12, suggestion: 'Uploadez le logo de votre agence' },
  { field: 'slogan', label: 'Slogan', weight: 5, suggestion: 'Ajoutez un slogan accrocheur' },
  { field: 'instagram_url', label: 'Instagram', weight: 5, suggestion: 'Liez votre compte Instagram' },
  { field: 'facebook_url', label: 'Facebook', weight: 5, suggestion: 'Liez votre page Facebook' },
  { field: 'cover_image_url', label: 'Image de couverture', weight: 7, suggestion: 'Ajoutez une image de couverture (plan Enterprise)' },
  { field: 'latitude', label: 'Position GPS', weight: 5, suggestion: 'Ajoutez les coordonnées GPS de votre agence' },
  { field: 'website', label: 'Site web', weight: 5, suggestion: 'Ajoutez l\'URL de votre site web' },
];

/**
 * Calcule le score de complétude du profil agence.
 */
export function calculateAgencyCompleteness(agency: Agency): CompletenessResult {
  const completed: string[] = [];
  const missing: string[] = [];
  const suggestions: string[] = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const check of CHECKS) {
    totalWeight += check.weight;
    const value = agency[check.field];

    const isFilled = value !== null && value !== undefined && value !== '' &&
      !(typeof value === 'string' && value.trim() === '');

    // Special check for description quality
    if (check.field === 'description' && typeof value === 'string' && value.length < 100) {
      missing.push(check.label);
      suggestions.push('Enrichissez votre description (actuellement trop courte)');
      continue;
    }

    if (isFilled) {
      earnedWeight += check.weight;
      completed.push(check.label);
    } else {
      missing.push(check.label);
      suggestions.push(check.suggestion);
    }
  }

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    score,
    completed,
    missing,
    suggestions: suggestions.slice(0, 5), // Top 5 suggestions
  };
}
