import type { Recipe } from '../types/recipe';

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    servings: 4,
    ingredients: [
      '400g spaghetti',
      '200g guanciale or pancetta, diced',
      '3 large eggs',
      '50g pecorino romano cheese, grated',
      '50g parmesan cheese, grated',
      'Freshly ground black pepper',
      'Salt'
    ],
    instructions: [
      'Bring a large pot of salted water to a boil and cook the spaghetti according to package instructions until al dente.',
      'While the pasta is cooking, heat a large skillet over medium heat and cook the guanciale or pancetta until crispy.',
      'In a bowl, whisk together the eggs, grated pecorino, and parmesan cheese. Season with black pepper.',
      'Drain the pasta, reserving about 1/2 cup of cooking water.',
      'Add the hot pasta to the skillet with the guanciale, remove from heat.',
      'Quickly pour in the egg and cheese mixture, stirring constantly to create a creamy sauce. Add splashes of pasta water as needed.',
      'Serve immediately with extra grated cheese and black pepper on top.'
    ],
    tags: ['Italian', 'Pasta', 'Quick', 'Dinner']
  },
  {
    id: '2',
    name: 'Chicken Tikka Masala',
    description: 'Grilled chunks of chicken in a creamy tomato sauce with Indian spices.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80',
    prepTime: '30 minutes',
    cookTime: '30 minutes',
    servings: 4,
    ingredients: [
      '800g chicken breast, cubed',
      '2 cups plain yogurt',
      '2 tbsp lemon juice',
      '6 cloves garlic, minced',
      '1 tbsp ginger, grated',
      '2 tsp ground cumin',
      '2 tsp ground coriander',
      '2 tsp garam masala',
      '2 tsp paprika',
      '1 can (400g) tomato sauce',
      '1 cup heavy cream',
      '2 tbsp vegetable oil',
      '1 large onion, finely chopped',
      'Fresh cilantro, for garnish',
      'Salt to taste'
    ],
    instructions: [
      'In a large bowl, mix yogurt, lemon juice, half the garlic, half the ginger, 1 tsp each of cumin, coriander, and garam masala, and paprika to make a marinade.',
      'Add chicken to the marinade, mix well, cover, and refrigerate for at least 1 hour (or overnight for best results).',
      'Heat oil in a large pan over medium heat. Add onions and cook until soft and translucent.',
      'Add remaining garlic and ginger, cooking for 1 minute until fragrant.',
      'Add the remaining spices and cook for another 30 seconds.',
      'Stir in tomato sauce and bring to a simmer.',
      'Meanwhile, grill or broil the marinated chicken until cooked through and slightly charred.',
      'Add the cooked chicken to the sauce, simmer for 10 minutes.',
      'Stir in cream and cook on low heat for 5 minutes. Adjust salt to taste.',
      'Garnish with fresh cilantro and serve with rice or naan bread.'
    ],
    tags: ['Indian', 'Curry', 'Chicken', 'Dinner']
  },
  {
    id: '3',
    name: 'Avocado Toast with Poached Egg',
    description: 'Simple yet delicious breakfast with creamy avocado and perfectly poached egg.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80',
    prepTime: '5 minutes',
    cookTime: '10 minutes',
    servings: 2,
    ingredients: [
      '2 slices of sourdough bread',
      '1 ripe avocado',
      '2 fresh eggs',
      '1 tbsp white vinegar',
      'Red pepper flakes',
      'Salt and pepper to taste',
      'Extra virgin olive oil',
      '1 lemon, for juice',
      'Fresh herbs (optional, such as chives or cilantro)'
    ],
    instructions: [
      'Toast the bread slices to your desired level of crispiness.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
      'Add a squeeze of lemon juice, salt, and pepper to the avocado and mash with a fork to your desired consistency.',
      'Bring a pot of water to a gentle simmer. Add white vinegar.',
      'Crack each egg into a small cup, then gently slide into the simmering water.',
      'Poach for 3-4 minutes until whites are set but yolk is still runny.',
      'Spread the mashed avocado on the toast slices.',
      'Top each toast with a poached egg.',
      'Sprinkle with salt, pepper, red pepper flakes, and a drizzle of olive oil.',
      'Garnish with fresh herbs if using, and serve immediately.'
    ],
    tags: ['Breakfast', 'Vegetarian', 'Quick', 'Healthy']
  },
  {
    id: '4',
    name: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies with gooey chocolate chips and crispy edges.',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80',
    prepTime: '15 minutes',
    cookTime: '12 minutes',
    servings: 24,
    ingredients: [
      '250g all-purpose flour',
      '1 tsp baking soda',
      '1/2 tsp salt',
      '170g unsalted butter, softened',
      '150g brown sugar, packed',
      '100g white sugar',
      '1 tsp vanilla extract',
      '2 large eggs',
      '300g chocolate chips',
      '100g chopped walnuts (optional)'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.',
      'In a small bowl, whisk together flour, baking soda, and salt.',
      'In a large bowl, cream together the butter, brown sugar, and white sugar until smooth and fluffy.',
      'Beat in the eggs one at a time, then stir in the vanilla.',
      'Gradually blend in the dry ingredients until just combined.',
      'Fold in the chocolate chips and walnuts if using.',
      'Drop rounded tablespoons of dough onto the prepared baking sheets, spacing them about 2 inches apart.',
      'Bake for 10-12 minutes or until edges are golden but centers are still soft.',
      'Allow cookies to cool on the baking sheet for 2 minutes before transferring to wire racks to cool completely.'
    ],
    tags: ['Dessert', 'Baking', 'Cookies', 'Sweet']
  },
  {
    id: '5',
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with tomatoes, cucumber, olives, and feta cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80',
    prepTime: '15 minutes',
    cookTime: '0 minutes',
    servings: 4,
    ingredients: [
      '4 large tomatoes, cut into chunks',
      '1 cucumber, sliced',
      '1 red onion, thinly sliced',
      '1 green bell pepper, chopped',
      '200g feta cheese, cubed',
      '100g kalamata olives',
      '2 tbsp extra virgin olive oil',
      '1 tbsp red wine vinegar',
      '1 tsp dried oregano',
      'Salt and freshly ground black pepper to taste'
    ],
    instructions: [
      'In a large bowl, combine tomatoes, cucumber, red onion, and green bell pepper.',
      'Add the olives and feta cheese to the bowl.',
      'In a small bowl, whisk together olive oil, red wine vinegar, and oregano to make the dressing.',
      'Pour the dressing over the salad and toss gently to combine.',
      'Season with salt and pepper to taste.',
      'Let the salad sit for about 10 minutes before serving to allow flavors to meld.',
      'Serve chilled or at room temperature.'
    ],
    tags: ['Greek', 'Salad', 'Vegetarian', 'Healthy', 'Quick']
  }
];
