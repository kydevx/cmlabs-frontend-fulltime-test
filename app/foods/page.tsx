'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchMealsByIngredient, Meal } from '@/lib/api';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import Skeleton from '@/components/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function IngredientDetailPage() {
  const params = useParams();
  const foodsId = decodeURIComponent(params.foodsId as string);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await fetchMealsByIngredient('');
        setMeals(data);
        setFilteredMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMeals();
  }, [foodsId]);

  useEffect(() => {
    const filtered = meals.filter(meal =>
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMeals(filtered);
  }, [searchTerm, meals]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-12 w-64 mb-6" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <nav className="flex text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500">Home</Link>
            <span className="mx-2">
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </span>
            <Link href={`/foods/${foodsId}`} className="hover:text-orange-500">Foods</Link>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
            Foods
          </h1>
          <Input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No meals found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
              <Link key={meal.idMeal} href={`/foods/${foodsId}/${meal.idMeal}`}>
                <Card className="overflow-hidden h-full group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMealThumb}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#00000042]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <h3 className="text-xl font-bold text-white capitalize text-center drop-shadow-lg">
                        {meal.strMeal}
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
