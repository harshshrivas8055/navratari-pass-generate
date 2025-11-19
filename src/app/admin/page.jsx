"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchAllUsers,
  togglePaymentStatus,
  deleteuser,
} from "@/app/redux-toolkit/adminSlice";
import Image from "next/image";

export default function AdminPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const openPDF = (id) => {
    window.open(`/api/admin/pdf?userId=${id}`, "_blank");
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

      {loading && (
        <p className="text-blue-500 text-lg animate-pulse">Loading...</p>
      )}

      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Image
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Name
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Email
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Payment
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                PDF
              </th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {users?.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  {u.image ? (
                    <Image
                      src={u.image}
                      width={180}
                      height={180}
                      unoptimized
                      alt="Profile"
                      className="w-14 h-14 rounded-md object-cover shadow"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No Image</span>
                  )}
                </td>

                <td className="py-3 px-4 text-gray-700 font-medium">
                  {u.firstname} {u.lastname}
                </td>

                <td className="py-3 px-4 text-gray-600">{u.email}</td>

                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      dispatch(
                        togglePaymentStatus({
                          id: u._id,
                          status: u.paymentStatus,
                        })
                      )
                    }
                    className={`px-4 py-2 rounded-lg font-semibold text-white shadow 
                      ${
                        u.paymentStatus
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } transition`}
                  >
                    {u.paymentStatus ? "Paid ✔" : "Unpaid ✖"}
                  </button>
                </td>

                <td className="py-3 px-4">
                  <button
                    disabled={!u.paymentStatus}
                    onClick={() => openPDF(u._id)}
                    className={`px-4 py-2 rounded-lg text-white font-semibold shadow transition
                      ${
                        u.paymentStatus
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    Generate PDF
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete ${u.firstname}?`
                        )
                      ) {
                        dispatch(deleteuser(u._id));
                      }
                    }}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 shadow transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
