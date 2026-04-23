'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchIngredients, Ingredient } from '@/lib/api';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import Skeleton from '@/components/Skeleton';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await fetchIngredients();
        setIngredients(data);
        setFilteredIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    }
    loadIngredients();
  }, []);

  useEffect(() => {
    const filtered = ingredients.filter(ingredient =>
      ingredient.strIngredient.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchTerm, ingredients]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-6 w-96 mb-6" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="overflow-hidden h-full">
                <Skeleton className="h-56 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥗 Ingredients
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Browse all available ingredients and discover delicious meals
          </p>
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredIngredients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No ingredients found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredIngredients.map((ingredient) => (
              <Link
                key={ingredient.idIngredient}
                href={`/foods/${encodeURIComponent(ingredient.strIngredient)}`}
              >
                <Card className="overflow-hidden h-full group">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={ingredient.strThumb}
                        alt={ingredient.strThumb}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[#00000042]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h3 className="text-xl font-bold text-white capitalize text-center drop-shadow-lg">
                          {ingredient.strIngredient}
                        </h3>
                      </div>
                    </div>
                  </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
