import React from 'react'

const getAuthUser = () => {
    const rawUser = localStorage.getItem("user");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const phone = localStorage.getItem("phone");

    if (!rawUser) return { email, role, phone };

    try {
        return { ...(JSON.parse(rawUser) || {}), email, role, phone };
    } catch {
        return { name: rawUser, email, role, phone };
    }
};

export default function UserProfile() {
    const user = getAuthUser();
    return (
        <div className="mx-auto max-w-5xl px-6 py-14 text-[#3d2b1a]">
            <h1 className="text-3xl font-semibold">My Profile</h1>
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
