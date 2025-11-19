'use client'

import React from 'react'
import { useParams } from 'next/navigation'

function IdPage() {
    const params = useParams();
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Page</h1>
      <h2 className="text-lg text-gray-600">
        ID: <span className="font-mono text-blue-600">{params.id}</span>
      </h2>
    </div>
  )
}

export default IdPage