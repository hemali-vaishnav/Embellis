import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { FiLogOut } from 'react-icons/fi'
import { baseUrl } from '../../../../utils/url'
import { resetCart } from '../../../redux/slices/cartSlice'
import { resetFavorites } from '../../../redux/slices/favoriteSlice'
import { notifyAuthChange } from '../../../commonfunction/useAuthState'
import { getAuthItem, clearAuthData } from '../../../commonfunction/authStorage'

const getAuthUser = () => {
    const rawUser = getAuthItem("user");
    const email = getAuthItem("email");
    const role = getAuthItem("role");
    const phone = getAuthItem("phone");

    if (!rawUser) return { email, role, phone };

    try {
        return { ...(JSON.parse(rawUser) || {}), email, role, phone };
    } catch {
        return { name: rawUser, email, role, phone };
    }
};

export default function UserProfile() {
    const user = getAuthUser();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        const token = getAuthItem("token");

        try {
            if (token) {
                await fetch(`${baseUrl}/users/logout`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } catch {
            // Still log the user out locally even if the request fails.
        } finally {
            clearAuthData();
            notifyAuthChange();
            dispatch(resetCart());
            dispatch(resetFavorites());
            navigate("/");
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 py-14 text-[#3d2b1a]">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold">My Profile</h1>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 rounded-lg border border-[#3d2b1a]/20 px-4 py-2 text-sm font-medium hover:bg-[#3d2b1a]/5 transition disabled:opacity-50"
                >
                    <FiLogOut />
                    {loggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
            <div className="mt-8 rounded-lg border border-[#3d2b1a]/15 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wider text-[#3d2b1a]/60">Account Details</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-[#3d2b1a]/55">Name</p>
                        <p className="mt-1 font-medium">{user.name || user.fullName || "Embellis Customer"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#3d2b1a]/55">Email</p>
                        <p className="mt-1 font-medium">{user.email || "No email found"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#3d2b1a]/55">Phone</p>
                        <p className="mt-1 font-medium">{user.phone || "No phone found"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
