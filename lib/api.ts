const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
  strThumb: string
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail extends Meal {
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  strTags?: string;
  [key: string]: any;
}

export async function fetchIngredients(): Promise<Ingredient[]> {
  const response = await fetch(`${BASE_URL}/list.php?i=list`, {
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data.meals || [];
}

export async function fetchMealsByIngredient(ingredientName: string): Promise<Meal[]> {
  const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredientName)}`, {
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data.meals || [];
}

export async function fetchMealDetail(mealId: string): Promise<MealDetail | null> {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${mealId}`, {
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data.meals?.[0] || null;
}

export async function fetchCategories(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/categories.php`, {
    next: { revalidate: 3600 }
  });
  const data = await response.json();
  return data.categories || [];
}
