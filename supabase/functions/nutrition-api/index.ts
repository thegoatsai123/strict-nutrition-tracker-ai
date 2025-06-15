import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    // Get API keys from Supabase secrets
    const USDA_API_KEY = Deno.env.get('USDA_API_KEY')
    const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY')
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

    if (!USDA_API_KEY || !SPOONACULAR_API_KEY) {
      throw new Error('API keys not configured')
    }

    let response

    switch (action) {
      case 'searchFoods': {
        const { query, pageSize = 25, pageNumber = 1, sortBy = 'dataType.keyword', sortOrder = 'asc', brandOwner } = params
        
        const searchParams = new URLSearchParams({
          api_key: USDA_API_KEY,
          query,
          pageSize: pageSize.toString(),
          pageNumber: pageNumber.toString(),
          sortBy,
          sortOrder
        })

        if (brandOwner) {
          searchParams.append('brandOwner', brandOwner)
        }

        const usdaResponse = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?${searchParams}`)
        const data = await usdaResponse.json()
        
        response = {
          success: true,
          data: {
            totalHits: data.totalHits,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            foods: data.foods
          }
        }
        break
      }

      case 'getFoodById': {
        const { fdcId } = params
        
        const usdaResponse = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`)
        const data = await usdaResponse.json()
        
        response = {
          success: true,
          data
        }
        break
      }

      case 'searchRecipes': {
        const { query, number = 12, offset = 0, diet, excludeIngredients, intolerances, type } = params
        
        const searchParams = new URLSearchParams({
          apiKey: SPOONACULAR_API_KEY,
          query,
          number: number.toString(),
          offset: offset.toString(),
          addRecipeInformation: 'true',
          addRecipeNutrition: 'true'
        })

        if (diet) searchParams.append('diet', diet)
        if (excludeIngredients) searchParams.append('excludeIngredients', excludeIngredients)
        if (intolerances) searchParams.append('intolerances', intolerances)
        if (type) searchParams.append('type', type)

        const spoonacularResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${searchParams}`)
        const data = await spoonacularResponse.json()
        
        response = {
          success: true,
          data: {
            results: data.results,
            offset: data.offset,
            number: data.number,
            totalResults: data.totalResults
          }
        }
        break
      }

      case 'getRecipeById': {
        const { id } = params
        
        const searchParams = new URLSearchParams({
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: 'true'
        })

        const spoonacularResponse = await fetch(`https://api.spoonacular.com/recipes/${id}/information?${searchParams}`)
        const data = await spoonacularResponse.json()
        
        response = {
          success: true,
          data
        }
        break
      }

      case 'getRandomRecipes': {
        const { tags, number = 6 } = params
        
        const searchParams = new URLSearchParams({
          apiKey: SPOONACULAR_API_KEY,
          number: number.toString(),
          include_nutrition: 'true'
        })

        if (tags && tags.length > 0) {
          searchParams.append('tags', tags.join(','))
        }

        const spoonacularResponse = await fetch(`https://api.spoonacular.com/recipes/random?${searchParams}`)
        const data = await spoonacularResponse.json()
        
        response = {
          success: true,
          data: {
            recipes: data.recipes
          }
        }
        break
      }

      case 'recognizeFood': {
        // Mock food recognition for now
        const mockPredictions = [
          { className: 'apple', confidence: 0.85 },
          { className: 'banana', confidence: 0.15 }
        ]

        response = {
          success: true,
          data: {
            predictions: mockPredictions
          }
        }
        break
      }

      case 'chatWithGroq': {
        if (!GROQ_API_KEY) {
          throw new Error('Groq API key not configured')
        }

        const { messages } = params

        const systemPrompt = {
          role: 'system',
          content: "You are an expert nutrition and fitness assistant for an app called NutriTracker. Your name is Nutri-AI. Be friendly, encouraging, and provide accurate, actionable advice. Keep your responses concise and easy to understand. You can answer questions about food, recipes, meal plans, exercises, and general wellness. When asked for recipes or food info, suggest using the app's features like 'Log Food' or 'Search Recipes'. Do not respond with JSON or markdown formatting, just plain text."
        }
        
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
          })
        });
        
        if (!groqResponse.ok) {
          const errorBody = await groqResponse.text();
          throw new Error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText} - ${errorBody}`)
        }

        const data = await groqResponse.json()
        const assistantMessage = data.choices[0]?.message?.content
        
        response = {
          success: true,
          assistantMessage
        }
        break
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Nutrition API error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
