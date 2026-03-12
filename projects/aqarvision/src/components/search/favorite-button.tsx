'use client';

import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { addFavorite, removeFavorite } from '@/lib/actions/favorites';
import { heartBounce } from '@/lib/animations';

interface FavoriteButtonProps {
  propertyId: string;
  isFavorited: boolean;
  isAuthenticated: boolean;
}

export function FavoriteButton({ propertyId, isFavorited, isAuthenticated }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!isFavorited) setAnimating(true);

    startTransition(async () => {
      if (isFavorited) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isPending}
      variants={heartBounce}
      animate={animating ? 'bounce' : 'idle'}
      onAnimationComplete={() => setAnimating(false)}
      whileTap={{ scale: 0.9 }}
      className={`rounded-full p-2 transition-colors ${
        isFavorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
      } ${isPending ? 'opacity-50' : ''}`}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
    </motion.button>
  );
}
