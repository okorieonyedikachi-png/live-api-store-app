// api.js - Dedicated API handling module

export async function fetchProductsByCategory(category = "all") {
  try {
    let url = "https://fakestoreapi.com/products?limit=10";
    if (category !== "all") {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}
