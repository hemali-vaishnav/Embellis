import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import ProductShowcase from '../Home/ProductShowcase/ProductShowcase'
import SubCategoryTabs from '../../common/SubCategoryTabs/SubCategoryTabs'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

const toTitleCase = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const SUB_CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Shirts', value: 'Shirts' },
  { label: 'T-Shirts', value: 'T-Shirts' },
];

export default function HandworkCollections() {
  const { gender } = useParams();
  const genderLabel = toTitleCase(gender);
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.products);
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const loggedIn = isLoggedIn();

  useEffect(() => {
    dispatch(
      fetchProducts({ category: 'Handwork', gender: genderLabel, subCategory: activeSubCategory || undefined })
    );
  }, [dispatch, genderLabel, activeSubCategory]);

  useEffect(() => {
    if (loggedIn) dispatch(fetchFavorites());
  }, [dispatch, loggedIn]);

  const handworkCategory = categories[0];

  return (
    <div className="pt-32 pb-20">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold text-center px-6">
          Handcrafted for {genderLabel}
        </h1>

        <div className="mb-14">
          <SubCategoryTabs options={SUB_CATEGORIES} active={activeSubCategory} onChange={setActiveSubCategory} />
        </div>
      </div>

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
