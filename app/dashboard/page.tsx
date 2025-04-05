"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CreditCard } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import MainLayout from "@/components/main-layout"
import LoanTable, { type Loan } from "@/components/dashboard/loan-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock data for user dashboard
const MOCK_LOANS: Loan[] = [
  {
    id: "1",
    user: {
      id: "3",
      name: "John Okeh",
    },
    amount: 50000,
    date: "June 09, 2021",
    status: "pending",
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "John Okeh",
    },
    amount: 100000,
    date: "June 07, 2021",
    status: "verified",
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "John Okeh",
    },
    amount: 150000,
    date: "June 27, 2021",
    status: "rejected",
  },
  {
    id: "4",
    user: {
      id: "3",
      name: "John Okeh",
    },
    amount: 100000,
    date: "May 27, 2021",
    status: "disbursed",
  },
]

export default function UserDashboard() {
  const [balance, setBalance] = useState(0)
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS)

  // Calculate balance based on disbursed loans
  useEffect(() => {
    const disbursedAmount = loans
      .filter((loan) => loan.status === "disbursed")
      .reduce((total, loan) => total + loan.amount, 0)

    setBalance(disbursedAmount)
  }, [loans])

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <MainLayout title="Dashboard - Loans">
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div className="ml-2">
                <p className="text-gray-600 text-sm">BALANCE</p>
                <p className="text-xl font-bold">{balance.toFixed(1)}</p>
              </div>
            </div>
            <Link href="/apply-loan">
              <Button variant="secondary">Get a Loan</Button>
            </Link>
          </div>

          <div className="flex border-t">
            <button className="flex-1 py-2 border-b-2 border-green-600 font-medium">Borrow Cash</button>
            <button className="flex-1 py-2 text-gray-500">Transact</button>
            <button className="flex-1 py-2 text-gray-500">Deposit Cash</button>
          </div>
        </div>

        <div className="mb-4">
          <Input type="search" placeholder="Search for loans" className="max-w-md" />
        </div>

        <LoanTable loans={loans} />
      </MainLayout>
    </ProtectedRoute>
  )
}

