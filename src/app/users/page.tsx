"use client";
import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdMoreHoriz,
  MdBlock,
  MdCheckCircle,
  MdOutlineMail,
  MdOutlinePhone,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useTheme } from "@/providers/ThemeProvider";
import { getAllUsersService, deleteUserService } from "@/services/user.service";
import {
  getPlanRole,
  getUserStatus,
  getUserJoinDate,
  UserData,
} from "@/types/users.type";
import { toast } from "react-hot-toast";

const LIMIT = 10;

export default function UsersPage() {
  const { currentTheme } = useTheme();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Derived pagination values — no state needed
  const totalPages = Math.ceil(filteredUsers.length / LIMIT);
  const startIndex = (currentPage - 1) * LIMIT;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + LIMIT);
  const currentStart = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const currentEnd = Math.min(currentPage * LIMIT, filteredUsers.length);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersService();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string | number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setActionLoading(userId.toString());
      await deleteUserService(userId.toString());
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getPlanBadgeClass = (planType?: string): string => {
    switch (planType) {
      case "ENTERPRISE":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "PLUS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "FREE":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: currentTheme.textColor }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: currentTheme.headingColor }}
          >
            User Management
          </h1>
          <p
            className="font-medium text-sm"
            style={{ color: currentTheme.textColor }}
          >
            Control user access, roles, and account status. (
            {filteredUsers.length} users)
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
              size={20}
              style={{ color: currentTheme.textColor }}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 transition-all"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textColor,
              }}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2.5 border rounded-lg hover:brightness-95 font-bold text-sm flex items-center gap-2 transition-all"
            style={{
              backgroundColor: currentTheme.cardBg,
              borderColor: currentTheme.borderColor,
              color: currentTheme.headingColor,
            }}
          >
            <MdFilterList size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border shadow-sm overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: currentTheme.cardBg + "E6",
          borderColor: currentTheme.borderColor,
        }}
      >
        <table className="w-full text-left">
          <thead
            className="border-b"
            style={{
              backgroundColor: currentTheme.background,
              borderColor: currentTheme.borderColor,
            }}
          >
            <tr>
              <th
                className="px-6 py-4 text-xs font-bold uppercase"
                style={{ color: currentTheme.textColor }}
              >
                User Profile
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase"
                style={{ color: currentTheme.textColor }}
              >
                Plan
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase"
                style={{ color: currentTheme.textColor }}
              >
                Contact Info
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase"
                style={{ color: currentTheme.textColor }}
              >
                Status
              </th>
              <th
                className="px-6 py-4 text-xs font-bold uppercase"
                style={{ color: currentTheme.textColor }}
              >
                Subscription
              </th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center"
                  style={{ color: currentTheme.textColor }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => {
                const planRole = getPlanRole(user);
                const status = getUserStatus(user);
                const joinDate = getUserJoinDate(user);
                const fullName = `${user.first_name} ${user.last_name}`;
                const isActionPending = actionLoading === user.id?.toString();
                const planType = user.subscription?.plan?.plan_type;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-500/5 transition-colors border-b last:border-0"
                    style={{ borderColor: currentTheme.borderColor }}
                  >
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold border"
                          style={{
                            backgroundColor: currentTheme.background,
                            borderColor: currentTheme.borderColor,
                            color: currentTheme.headingColor,
                          }}
                        >
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-bold text-sm"
                            style={{ color: currentTheme.headingColor }}
                          >
                            {fullName}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.textColor }}
                          >
                            subscribed {formatDate(joinDate)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPlanBadgeClass(planType)}`}
                      >
                        {user.subscription?.plan?.display_name ?? planRole}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div
                          className="flex items-center gap-2 text-xs font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          <MdOutlineMail />{" "}
                          {user.email || user.username || "N/A"}
                        </div>
                        <div
                          className="flex items-center gap-2 text-xs font-medium"
                          style={{ color: currentTheme.textColor }}
                        >
                          <MdOutlinePhone /> {user.phone_number || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {status === "Active" ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                          <MdCheckCircle size={16} /> Active
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-1.5 text-xs font-bold"
                          style={{ color: currentTheme.textColor }}
                        >
                          <MdBlock size={16} /> Inactive
                        </div>
                      )}
                    </td>

                    {/* Subscription dates */}
                    <td className="px-6 py-4">
                      {user.subscription ? (
                        <div className="flex flex-col gap-0.5">
                          <p
                            className="text-xs font-medium"
                            style={{ color: currentTheme.headingColor }}
                          >
                            Until {formatDate(user.subscription.end_date)}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.textColor }}
                          >
                            {user.subscription.plan?.price === 0
                              ? "Free"
                              : `₹${user.subscription.plan?.price}/mo`}
                          </p>
                        </div>
                      ) : (
                        <span
                          className="text-xs"
                          style={{ color: currentTheme.textColor }}
                        >
                          No subscription
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isActionPending}
                          className="p-2 rounded-full transition-all hover:bg-gray-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: currentTheme.textColor }}
                        >
                          <MdMoreHoriz size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredUsers.length > LIMIT && (
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 border-t mt-8"
          style={{ borderColor: currentTheme.borderColor }}
        >
          {/* Showing X to Y of Z */}
          <div
            className="text-sm opacity-70"
            style={{ color: currentTheme.textColor }}
          >
            Showing <span className="font-bold">{currentStart}</span> to{" "}
            <span className="font-bold">{currentEnd}</span> of{" "}
            <span className="font-bold">{filteredUsers.length}</span> entries
          </div>

          {/* Page buttons */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.headingColor,
              }}
            >
              <MdChevronLeft size={20} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    currentPage === pageNum
                      ? "text-white shadow-md transform scale-105"
                      : "hover:bg-black/5"
                  }`}
                  style={{
                    backgroundColor:
                      currentPage === pageNum
                        ? currentTheme.primary
                        : "transparent",
                    color:
                      currentPage === pageNum ? "#fff" : currentTheme.textColor,
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.headingColor,
              }}
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
