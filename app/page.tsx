'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories } from '@/lib/api';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import Skeleton from '@/components/Skeleton';

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            <Skeleton className="h-6 w-64 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-28">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden h-full">
                <Skeleton className="h-32 w-full" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center space-x-3 mb-4">
            <Image src="/soup-food-and-restaurant-svgrepo-com.svg" alt="Food icon" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(88%) saturate(1388%) hue-rotate(352deg) brightness(96%) contrast(92%)' }} />
            <Image src="/rice-svgrepo-com.svg" alt="Food icon" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(88%) saturate(1388%) hue-rotate(352deg) brightness(96%) contrast(92%)' }} className='ml-2 mr-4' />
            <Image src="/christmas-food-bakery-sweet-cookie-svgrepo-com.svg" alt="Food icon" width={24} height={24} style={{ filter: 'brightness(0) saturate(100%) invert(39%) sepia(88%) saturate(1388%) hue-rotate(352deg) brightness(96%) contrast(92%)' }} />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto text-bold mb-4">
            mealapp API website
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            See All The Delicious Foods
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-28">
          {categories.map((category) => (
            <Link key={category.idCategory} href={`/foods/${category.strCategory}`}>
              <Card className="overflow-hidden h-full group">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={category.strCategoryThumb}
                    alt={category.strCategory}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#00000042]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <h3 className="text-xl font-bold text-white capitalize text-center drop-shadow-lg">
                      {category.strCategory}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
