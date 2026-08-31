import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductShowcase from '../Home/ProductShowcase/ProductShowcase'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

export default function MenCollections() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts('Men'));
    if (isLoggedIn()) dispatch(fetchFavorites());
  }, [dispatch]);

  const menCategory = categories[0];

  return (
    <div className="pt-32 pb-20">
      <h1 className="text-3xl font-semibold text-center mb-10">Men's Collection</h1>

      {loading && (
        <p className="text-center text-sm text-gray-400">Loading products...</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && !menCategory && (
        <p className="text-center text-sm text-gray-400">No products found in this category.</p>
      )}

      {menCategory && <ProductShowcase products={menCategory.products} />}
    </div>
  )
}
