import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // Fetch users from localStorage
  const fetchUsers = () => {
    const storedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(storedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activate User
  const activateUser = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, status: "Active" }
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);
  };

  // Suspend User
  const suspendUser = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, status: "Suspended" }
        : user
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);
  };

  // Delete User
  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;

    const updatedUsers = users.filter(
      (user) => user.id !== id
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    setUsers(updatedUsers);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Manage Users
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F98603] text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{user.name}</td>

                      <td className="p-3">{user.email}</td>

                      <td className="p-3">
                        {user.phone || "-"}
                      </td>

                      <td className="p-3 capitalize">
                        {user.role}
                      </td>

                      <td className="p-3">
                        <span
                          className={`font-semibold ${
                            user.status === "Active"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {user.status || "Active"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              activateUser(user.id)
                            }
                          >
                            Activate
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              suspendUser(user.id)
                            }
                          >
                            Suspend
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteUser(user.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}