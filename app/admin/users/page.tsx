"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const apiKey = localStorage.getItem("adminApiKey")

        if (!apiKey) {
          router.push("/admin/login")
          return
        }

        const response = await fetch("/api/admin/users", {
          headers: {
            "x-api-key": apiKey,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("adminApiKey")
            router.push("/admin/login")
            return
          }
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError("Failed to load users data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [router])

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Kullanıcılar</h1>
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Kullanıcılar</h1>
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Kullanıcılar</h1>

      <Card className="bg-[#1E1E1E] border-[#2A2A2A] text-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                  <TableHead className="text-gray-300">Tarih</TableHead>
                  <TableHead className="text-gray-300">Telegram ID</TableHead>
                  <TableHead className="text-gray-300">Kullanıcı Adı</TableHead>
                  <TableHead className="text-gray-300">Nickname</TableHead>
                  <TableHead className="text-gray-300">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]">
                      <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-gray-300">{user.telegram_id}</TableCell>
                      <TableCell className="text-gray-300">{user.username || "-"}</TableCell>
                      <TableCell className="text-gray-300">{user.nickname || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-300 hover:text-white">
                          Detay
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-300 py-4">
                      Henüz kullanıcı bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
