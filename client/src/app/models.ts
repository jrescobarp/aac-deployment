export interface Recipe {
  _id?: string;
  name: string;
  description: string;
  portions: string;
  steps: string[];
  verbs: string[];
  ingredients: string[];
  type: string[];
  connected_recipes: string[];
  comments: Comment[];
  images: Image[];
  featured_meal_count: number;
  book: string[];
}

export interface User {
  _id?: string;
  first_name: string;
  last_name: string;
  username:string;
  email: string;
  password: string;
  comments: Comment[];
  images: Image[];
  recipes: Recipe[];
  recipe_history: Recipe[];
  tssci: boolean;
}

export interface Comment {
  _id?: string;
  user_id: string;
  username: string;
  text: string;
  upvotes: string[];
  replies: Comment[];
  parent_id: string,
  parent_type: string,
  update_arr: Comment[];
  date_created: number;
  // location: string;
}

export interface imageData {
  url: string;
  filename: string;
}

export interface Image {
  _id?: string;
  imgDataArr: imageData[];
  user_id:string;
  recipe_id:string;
  description:string;
  username: string;
  upvotes: string[];
  // report: string;
  comments: Comment[];
}
