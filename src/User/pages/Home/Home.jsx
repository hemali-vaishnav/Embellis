import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Herobanner from './Herobanner/Herobanner'
import TrustBadges from './TrustBadges/TrustBadges'
import TrendingCarousel from './TrendingCarousel/TrendingCarousel'
import BestSaleShowcase from './BestSaleShowcase/BestSaleShowcase'
import CustomPromoBanner from './CustomPromoBanner/CustomPromoBanner'
import { fetchTrending, fetchBestSellers } from '../../../redux/slices/featuredSlice'
import { fetchFavorites } from '../../../redux/slices/favoriteSlice'

const isLoggedIn = () => Boolean(localStorage.getItem('token'));

export default function Home() {
  const dispatch = useDispatch();
  const { trending, trendingLoading, bestSellers, bestSellersLoading } = useSelector(
    (state) => state.featured
  );

  useEffect(() => {
    dispatch(fetchTrending(10));
    dispatch(fetchBestSellers(10));
    if (isLoggedIn()) dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div>
      <Herobanner />

      <TrustBadges />

      {!trendingLoading && trending.length > 0 && (
        <TrendingCarousel title="Trending Collection" products={trending} />
      )}

      <CustomPromoBanner />

      {!bestSellersLoading && bestSellers.length > 0 && (
        <BestSaleShowcase title="Best Sale" products={bestSellers} />
      )}
    </div>
  )
}
