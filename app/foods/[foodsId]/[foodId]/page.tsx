'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchMealDetail, MealDetail } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Skeleton from '@/components/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function MealDetailPage() {
  const params = useParams();
  const foodId = params.foodId as string;
  const foodsId = params.foodsId as string;
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMealDetail() {
      try {
        const data = await fetchMealDetail(foodId);
        setMeal(data);
      } catch (error) {
        console.error('Error fetching meal detail:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMealDetail();
  }, [foodId]);

  function getIngredients(meal: MealDetail) {
    const ingredients: { name: string; measure: string }[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient,
          measure: measure || ''
        });
      }
    }
    return ingredients;
  }

  function getYouTubeEmbedUrl(url: string) {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-5 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-xl">Meal not found</p>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(meal);
  const youtubeUrl = getYouTubeEmbedUrl(meal.strYoutube || '');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex text-sm text-gray-500 mb-6 items-center">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span className="mx-2">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </span>
          <Link href={`/foods/${foodsId}`} className="hover:text-orange-500">Foods</Link>
          <span className="mx-2">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </span>
          <Link href={`/foods/${foodsId}`} className="hover:text-orange-500">{foodsId}</Link>
          <span className="mx-2">
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </span>
          <span className="text-gray-900 font-medium">{meal.strMeal}</span>
        </nav>

        <div className="text-2xl text-gray-700 mb-12">
          {meal.strMeal}
        </div>
        <div className=' text-orange-600 mb-2'>
          {meal.strArea} {meal.strCategory}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">

            <div className="">
              <h2 className="text-2xl text-gray-700 mb-4 flex items-center gap-2">
                Instructions
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed space-y-3">
                {meal.strInstructions?.split('\r\n').map((instruction, index) => (
                  instruction.trim() && (
                    <p key={index} className="flex gap-3 text-sm">
                      <span>{instruction}</span>
                    </p>
                  )
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl text-gray-700 mb-4 flex items-center gap-2">
                Recipes
              </h2>
              <ul className="space-y-2 list-disc list-inside">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className='text-gray-700 text-sm'>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {youtubeUrl && (
              <div>
                <div className="border-b border-gray-100 flex items-center justify-center mt-10 mb-2">
                  <h2 className="text-2xl text-center text-gray-700 flex items-center gap-2">
                    Tutorial
                  </h2>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={youtubeUrl}
                    title={meal.strMeal}
                    className="w-full h-96"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
