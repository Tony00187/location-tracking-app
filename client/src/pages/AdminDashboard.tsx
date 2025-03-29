import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { type Location } from "@shared/schema";

interface UserLocationData {
  userId: string;
  count: number;
  locations: Location[];
}

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userLocations, setUserLocations] = useState<UserLocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active users (we'll simulate this for now)
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        // In a real app, you would fetch this from your backend
        const response = await apiRequest("GET", "/api/users/active");
        if (response.ok) {
          const data = await response.json();
          setActiveUsers(data.users);
        } else {
          // For demo, we'll use some mock data
          // In production, you would handle this error properly
          console.warn("Using sample data as couldn't fetch active users");
          
          // Get the user ID from localStorage if available
          const storedUserId = localStorage.getItem("userId");
          const demoUsers = storedUserId ? [storedUserId] : [];
          setActiveUsers(demoUsers);
        }
      } catch (err) {
        console.error("Error fetching active users:", err);
        setError("Failed to fetch active users. Please try again later.");
        
        // Get the user ID from localStorage if available
        const storedUserId = localStorage.getItem("userId");
        const demoUsers = storedUserId ? [storedUserId] : [];
        setActiveUsers(demoUsers);
      }
    };

    fetchActiveUsers();
    
    // Refresh the user list every 30 seconds
    const intervalId = setInterval(fetchActiveUsers, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch user locations when a user is selected
  useEffect(() => {
    if (!selectedUser) {
      setUserLocations(null);
      return;
    }

    const fetchUserLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest("GET", `/api/location/${selectedUser}`);
        if (response.ok) {
          const data = await response.json();
          setUserLocations(data);
        } else {
          setError("Failed to fetch location data. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching user locations:", err);
        setError("An error occurred while fetching location data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLocations();
    
    // Refresh location data every 10 seconds
    const intervalId = setInterval(fetchUserLocations, 10000);
    
    return () => clearInterval(intervalId);
  }, [selectedUser]);

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Layout fullWidth>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Active Users</TabsTrigger>
            <TabsTrigger value="map" disabled={!selectedUser}>Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Users List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeUsers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-6">
                      No active users found. Users will appear here when they share their location.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {activeUsers.map((userId) => (
                        <li key={userId}>
                          <button
                            onClick={() => setSelectedUser(userId)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                              selectedUser === userId
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"
                            }`}
                          >
                            User: {userId.substring(0, 15)}...
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* User Location Details */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedUser
                      ? `Location Data for User: ${selectedUser.substring(0, 10)}...`
                      : "Select a user to view location data"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedUser ? (
                    <p className="text-muted-foreground text-center py-10">
                      Select a user from the left panel to view their location data.
                    </p>
                  ) : loading ? (
                    <div className="flex justify-center py-10">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-destructive py-10">
                      <p>{error}</p>
                    </div>
                  ) : !userLocations || userLocations.locations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">
                      No location data available for this user.
                    </p>
                  ) : (
                    <>
                      {/* Current Location Card */}
                      <div className="mb-6 bg-secondary/30 p-4 rounded-md">
                        <h3 className="font-medium mb-2">Current Location</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Latitude:</span>{" "}
                            <span className="font-medium">
                              {userLocations.locations[0].latitude.toFixed(6)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Longitude:</span>{" "}
                            <span className="font-medium">
                              {userLocations.locations[0].longitude.toFixed(6)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>{" "}
                            <span className="font-medium">
                              {userLocations.locations[0].accuracy.toFixed(1)} meters
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Updated:</span>{" "}
                            <span className="font-medium">
                              {formatTimestamp(userLocations.locations[0].timestamp)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <a 
                            href={`https://www.google.com/maps?q=${userLocations.locations[0].latitude},${userLocations.locations[0].longitude}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary underline text-sm"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>

                      {/* Location History Table */}
                      <h3 className="font-medium mb-2">Location History</h3>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Latitude</TableHead>
                              <TableHead>Longitude</TableHead>
                              <TableHead>Accuracy</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userLocations.locations.map((location) => (
                              <TableRow key={location.id}>
                                <TableCell>
                                  {formatTimestamp(location.timestamp)}
                                </TableCell>
                                <TableCell>
                                  {location.latitude.toFixed(6)}
                                </TableCell>
                                <TableCell>
                                  {location.longitude.toFixed(6)}
                                </TableCell>
                                <TableCell>
                                  {location.accuracy.toFixed(1)} m
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-10">
                  To integrate a real map, you would need to use a mapping library like Leaflet, Google Maps, or Mapbox.
                  For simplicity, we're linking to Google Maps above.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}