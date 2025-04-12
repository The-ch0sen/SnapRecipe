'use client'

import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Icons} from '@/components/icons';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";

interface Recipe {
  recipeName: string;
  ingredients: string[];
  instructions: string;
  confidence: number;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [servingSize, setServingSize] = useState<number>(1);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const [occasion, setOccasion] = useState('');

  const suggestRecipe = async () => {
    setLoading(true);
    try {
      const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');

      if (filteredIngredients.length === 0) {
        toast({
          variant: 'destructive',
          title: '錯誤',
          description: '請輸入至少一個食材。',
        });
        setLoading(false);
        return;
      }

      const response = await fetch('/api/suggest-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ingredients: filteredIngredients.join(','), servingSize, occasion}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message && (errorData.message.includes('API key expired') || errorData.message.includes('API key invalid'))) {
          toast({
            variant: 'destructive',
            title: 'API 密鑰錯誤',
            description: '您的 API 密鑰已過期或無效。請更新您的 API 密鑰。',
          });
        } else {
          toast({
            variant: 'destructive',
            title: '錯誤',
            description: errorData.message || '生成食譜失敗，請重試。',
          });
        }
      } else {
        const recipeData: Recipe = await response.json();
        setRecipe(recipeData);
        toast({
          title: '食譜建議!',
          description: '請查看下方 AI 食譜建議。',
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: '錯誤',
        description: error.message || '生成食譜失敗，請重試。',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestRecipe = async () => {
    await suggestRecipe();
  };

   const handleSuggestAnotherRecipe = async () => {
      await suggestRecipe();
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 text-foreground">
        AI 食譜建議系統
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        根據您的食材取得個人化的食譜建議。
      </p>

      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>輸入食材</CardTitle>
          <CardDescription>輸入您擁有的食材與人份數量，以取得食譜建議。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ingredients">食材</Label>
             {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    id={`ingredients-${index}`}
                    placeholder="例如：番茄、九層塔、大蒜"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addIngredient}>
                新增食材
              </Button>
          </div>
           <div className="grid gap-2">
              <Label htmlFor="occasion">食譜場合</Label>
              <Select onValueChange={(value) => setOccasion(value)}>
                <SelectTrigger id="occasion">
                  <SelectValue placeholder="選擇食譜場合" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="日常">日常</SelectItem>
                  <SelectItem value="慶祝">慶祝</SelectItem>
                  <SelectItem value="派對">派對</SelectItem>
                  <SelectItem value="特殊節日">特殊節日</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <div className="grid gap-2">
            <Label htmlFor="serving-size">人份數量</Label>
            <Select onValueChange={(value) => setServingSize(Number(value))}>
              <SelectTrigger id="serving-size">
                <SelectValue placeholder="選擇人份數量"/>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? '人' : '人'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSuggestRecipe} disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
            搜尋食譜
          </Button>
        </CardContent>
      </Card>

      {recipe && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{recipe.recipeName}</CardTitle>
            <CardDescription>這裡是您的AI食譜建議 (信心指數: {recipe.confidence.toFixed(2)}).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold">食材:</h3>
              <ul className="list-disc pl-5">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">步驟:</h3>
              <Textarea readOnly value={recipe.instructions} className="min-h-[100px]"/>
            </div>
            <Button onClick={handleSuggestAnotherRecipe} disabled={loading}>
                {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>}
                取得不一樣的食譜
            </Button>
          </CardContent>
        </Card>
      )}

      <footer className="text-center mt-16 text-muted-foreground">
      </footer>
    </div>
  );
}
