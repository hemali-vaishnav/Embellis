import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Herobanner from './Herobanner/Herobanner'
import ProductShowcase from './ProductShowcase/ProductShowcase'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

export default function Home() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    if (isLoggedIn()) dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div>
      <Herobanner />

      {loading && (
        <p className="text-center py-10 text-sm text-gray-400">Loading products...</p>
      )}

      {error && (
        <p className="text-center py-10 text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="text-center py-10 text-sm text-gray-400">No products available yet.</p>
      )}

      {categories.map((cat) => (
        <ProductShowcase key={cat.category} title={cat.category} products={cat.products} />
      ))}
    </div>
  )
}
