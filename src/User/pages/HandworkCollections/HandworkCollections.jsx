import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import ProductShowcase from '../Home/ProductShowcase/ProductShowcase'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

const toTitleCase = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export default function HandworkCollections() {
  const { gender } = useParams();
  const subCategory = toTitleCase(gender);
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ category: 'Handwork', subCategory }));
    if (isLoggedIn()) dispatch(fetchFavorites());
  }, [dispatch, subCategory]);

  const handworkCategory = categories[0];

  return (
    <div className="pt-32 pb-20">
      <h1 className="text-3xl font-semibold text-center mb-10">
        Handcrafted for {subCategory}
      </h1>

      {loading && (
        <p className="text-center text-sm text-gray-400">Loading products...</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && !handworkCategory && (
        <p className="text-center text-sm text-gray-400">No products found in this category.</p>
      )}

      {handworkCategory && <ProductShowcase products={handworkCategory.products} />}
    </div>
  )
}
