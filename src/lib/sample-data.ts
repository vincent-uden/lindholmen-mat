import type { RestaurantMenu } from "./types";

// Sample data for demonstration purposes
// Replace this with your actual data fetching logic
export const sampleRestaurants: RestaurantMenu[] = [
  {
    name: "The Gourmet Kitchen",
    days: [
      {
        date: new Date("2023-11-01"),
        meals: [
          { category: "Breakfast", name: "Avocado Toast with Poached Eggs" },
          { category: "Breakfast", name: "Greek Yogurt Parfait" },
          { category: "Lunch", name: "Grilled Chicken Caesar Salad" },
          { category: "Lunch", name: "Vegetable Quinoa Bowl" },
          { category: "Dinner", name: "Herb-Crusted Salmon" },
          { category: "Dinner", name: "Mushroom Risotto" },
        ],
      },
      {
        date: new Date("2023-11-02"),
        meals: [
          { category: "Breakfast", name: "Spinach and Feta Omelette" },
          { category: "Breakfast", name: "Overnight Oats with Berries" },
          { category: "Lunch", name: "Turkey and Avocado Wrap" },
          { category: "Lunch", name: "Tomato Basil Soup" },
          { category: "Dinner", name: "Beef Tenderloin with Red Wine Sauce" },
          { category: "Dinner", name: "Eggplant Parmesan" },
        ],
      },
      {
        date: new Date("2023-11-03"),
        meals: [
          { category: "Breakfast", name: "Smoked Salmon Bagel" },
          { category: "Breakfast", name: "Fruit and Granola Bowl" },
          { category: "Lunch", name: "Mediterranean Chickpea Salad" },
          { category: "Lunch", name: "Butternut Squash Soup" },
          { category: "Dinner", name: "Grilled Ribeye Steak" },
          { category: "Dinner", name: "Vegetable Lasagna" },
        ],
      },
    ],
  },
  {
    name: "Fresh & Healthy",
    days: [
      {
        date: new Date("2023-11-01"),
        meals: [
          { category: "Breakfast", name: "Acai Bowl with Fresh Fruits" },
          {
            category: "Breakfast",
            name: "Spinach and Mushroom Egg White Omelette",
          },
          { category: "Lunch", name: "Kale and Quinoa Salad" },
          { category: "Lunch", name: "Lentil Soup" },
          { category: "Dinner", name: "Grilled Fish Tacos" },
          { category: "Dinner", name: "Roasted Vegetable Buddha Bowl" },
        ],
      },
      {
        date: new Date("2023-11-02"),
        meals: [
          { category: "Breakfast", name: "Chia Seed Pudding" },
          { category: "Breakfast", name: "Avocado and Egg Breakfast Sandwich" },
          { category: "Lunch", name: "Chickpea and Vegetable Wrap" },
          { category: "Lunch", name: "Sweet Potato and Carrot Soup" },
          { category: "Dinner", name: "Baked Salmon with Dill" },
          { category: "Dinner", name: "Cauliflower Rice Stir Fry" },
        ],
      },
    ],
  },
  {
    name: "Italiano Classico",
    days: [
      {
        date: new Date("2023-11-01"),
        meals: [
          { category: "Antipasti", name: "Bruschetta al Pomodoro" },
          { category: "Antipasti", name: "Caprese Salad" },
          { category: "Primi", name: "Spaghetti Carbonara" },
          { category: "Primi", name: "Risotto ai Funghi" },
          { category: "Secondi", name: "Chicken Piccata" },
          { category: "Secondi", name: "Eggplant Parmigiana" },
          { category: "Dolci", name: "Tiramisu" },
          { category: "Dolci", name: "Panna Cotta" },
        ],
      },
      {
        date: new Date("2023-11-02"),
        meals: [
          { category: "Antipasti", name: "Arancini" },
          { category: "Antipasti", name: "Prosciutto e Melone" },
          { category: "Primi", name: "Fettuccine Alfredo" },
          { category: "Primi", name: "Gnocchi al Pesto" },
          { category: "Secondi", name: "Osso Buco" },
          { category: "Secondi", name: "Grilled Mediterranean Sea Bass" },
          { category: "Dolci", name: "Cannoli" },
          { category: "Dolci", name: "Gelato Assortito" },
        ],
      },
      {
        date: new Date("2023-11-03"),
        meals: [
          { category: "Antipasti", name: "Calamari Fritti" },
          { category: "Antipasti", name: "Antipasto Misto" },
          { category: "Primi", name: "Lasagna alla Bolognese" },
          { category: "Primi", name: "Ravioli di Ricotta e Spinaci" },
          { category: "Secondi", name: "Saltimbocca alla Romana" },
          { category: "Secondi", name: "Branzino al Forno" },
          { category: "Dolci", name: "Torta della Nonna" },
          { category: "Dolci", name: "Affogato" },
        ],
      },
    ],
  },
  {
    name: "Spice Route",
    days: [
      {
        date: new Date("2023-11-01"),
        meals: [
          { category: "Appetizers", name: "Vegetable Samosas" },
          { category: "Appetizers", name: "Chicken Satay" },
          { category: "Main Courses", name: "Butter Chicken" },
          { category: "Main Courses", name: "Pad Thai" },
          { category: "Main Courses", name: "Beef Rendang" },
          { category: "Sides", name: "Garlic Naan" },
          { category: "Sides", name: "Coconut Rice" },
          { category: "Desserts", name: "Mango Sticky Rice" },
        ],
      },
      {
        date: new Date("2023-11-02"),
        meals: [
          { category: "Appetizers", name: "Spring Rolls" },
          { category: "Appetizers", name: "Paneer Tikka" },
          { category: "Main Courses", name: "Green Curry with Tofu" },
          { category: "Main Courses", name: "Lamb Biryani" },
          { category: "Main Courses", name: "Singapore Noodles" },
          { category: "Sides", name: "Roti Canai" },
          { category: "Sides", name: "Cucumber Raita" },
          { category: "Desserts", name: "Gulab Jamun" },
        ],
      },
    ],
  },
];
