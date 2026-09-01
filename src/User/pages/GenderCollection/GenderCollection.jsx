import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductShowcase from '../Home/ProductShowcase/ProductShowcase'
import SubCategoryTabs from '../../common/SubCategoryTabs/SubCategoryTabs'
import { fetchProducts } from '../../../redux/slices/productSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

const SUB_CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Shirts', value: 'Shirts' },
  { label: 'T-Shirts', value: 'T-Shirts' },
];

export default function GenderCollection({ category, title }) {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.products);
  const [activeSubCategory, setActiveSubCategory] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ category, subCategory: activeSubCategory || undefined }));
    if (isLoggedIn()) dispatch(fetchFavorites());
  }, [dispatch, category, activeSubCategory]);

  const productGroup = categories[0];

  return (
    <div className="pt-32 pb-20">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold text-center px-6">{title}</h1>

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

      {!loading && !error && !productGroup && (
        <p className="text-center text-sm text-gray-400">No products found in this category.</p>
      )}

      {productGroup && <ProductShowcase products={productGroup.products} />}
    </div>
  )
}
