import { useState, useEffect } from 'react';
import { PersonalizedSensoryJourney } from './components/PersonalizedSensoryJourney';
import { personalities, getPersonalityFromUrl } from './types/personality';
import type { PersonalityType } from './types/personality';

export interface SensoryExperience {
  id: string;
  sense: 'touch' | 'smell' | 'sight' | 'sound' | 'taste';
  name: string;
  description: string;
  icon: string;
  color: string;
  collected: boolean;
  timestamp?: number;
  interactionData?: any;
}

export default function App() {
  // Ottieni personalità da URL params (es: ?p=custode-verde)
  // TODO: Questa personalità dovrebbe venire dal form precedente
  const [personalityType] = useState<PersonalityType>(getPersonalityFromUrl());
  const personality = personalities[personalityType];

  // Ordine: udito, tatto, olfatto, vista, gusto
  const [experiences, setExperiences] = useState<SensoryExperience[]>([
    {
      id: 'sound',
      sense: 'sound',
      name: 'Udito',
      description: 'La Sinfonia Nascosta',
      icon: 'Ear',
      color: 'from-[#88D4AB] to-[#A8E6CF]',
      collected: false
    },
    {
      id: 'touch',
      sense: 'touch',
      name: 'Tatto',
      description: 'La Memoria della Texture',
      icon: 'Hand',
      color: 'from-[#A8E6CF] to-[#B8E6D5]',
      collected: false
    },
    {
      id: 'smell',
      sense: 'smell',
      name: 'Olfatto',
      description: 'L\'Archivio degli Aromi',
      icon: 'Wind',
      color: 'from-[#88D4AB] to-[#A8E6CF]',
      collected: false
    },
    {
      id: 'sight',
      sense: 'sight',
      name: 'Vista',
      description: 'Il Caleidoscopio del Cacao',
      icon: 'Eye',
      color: 'from-[#A8E6CF] to-[#C8E6D7]',
      collected: false
    },
    {
      id: 'taste',
      sense: 'taste',
      name: 'Gusto',
      description: 'La Temperatura del Ricordo',
      icon: 'Sparkles',
      color: 'from-[#88D4AB] via-[#A8E6CF] to-[#B8E6D5]',
      collected: false
    }
  ]);

  useEffect(() => {
    // Carica da localStorage con chiave specifica per personalità
    const storageKey = `noca-sensory-journey-${personalityType}`;
    const savedExperiences = localStorage.getItem(storageKey);
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences));
    }
  }, [personalityType]);

  const handleExperienceCollect = (experienceId: string, data?: any) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId
        ? { ...exp, collected: true, timestamp: Date.now(), interactionData: data }
        : exp
    );
    setExperiences(updatedExperiences);
    
    // Salva con chiave specifica per personalità
    const storageKey = `noca-sensory-journey-${personalityType}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedExperiences));
  };

  const handleReset = () => {
    const resetExperiences = experiences.map(exp => ({ 
      ...exp, 
      collected: false, 
      timestamp: undefined,
      interactionData: undefined 
    }));
    setExperiences(resetExperiences);
    
    // Rimuovi da localStorage
    const storageKey = `noca-sensory-journey-${personalityType}`;
    localStorage.removeItem(storageKey);
  };

  return (
    <PersonalizedSensoryJourney
      personality={personality}
      experiences={experiences}
      onExperienceCollect={handleExperienceCollect}
      onReset={handleReset}
    />
  );
}
