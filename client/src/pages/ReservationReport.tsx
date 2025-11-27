import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Filter } from "lucide-react";
import { format } from "date-fns";

interface Reservation {
  id: string;
  slotLabel: string;
  slotType: string;
  userEmail?: string;
  reservationDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "active" | "completed" | "cancelled";
  durationHours: number;
  amount?: number;
  paymentStatus: "pending" | "completed" | "failed";
}

// Mock data for demonstration
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "res-001",
    slotLabel: "A-001",
    slotType: "standard",
    userEmail: "john@example.com",
    reservationDate: new Date().toISOString(),
    checkInTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    checkOutTime: new Date(Date.now() - 1 * 3600000).toISOString(),
    status: "completed",
    durationHours: 2,
    amount: 500,
    paymentStatus: "completed",
  },
  {
    id: "res-002",
    slotLabel: "A-005",
    slotType: "ev",
    userEmail: "jane@example.com",
    reservationDate: new Date().toISOString(),
    checkInTime: new Date().toISOString(),
    status: "active",
    durationHours: 3,
    amount: 750,
    paymentStatus: "completed",
  },
  {
    id: "res-003",
    slotLabel: "A-012",
    slotType: "disabled",
    userEmail: "mike@example.com",
    reservationDate: new Date(Date.now() + 86400000).toISOString(),
    status: "active",
    durationHours: 1,
    amount: 250,
    paymentStatus: "pending",
  },
  {
    id: "res-004",
    slotLabel: "A-018",
    slotType: "standard",
    userEmail: "sarah@example.com",
    reservationDate: new Date(Date.now() - 86400000).toISOString(),
    checkInTime: new Date(Date.now() - 86400000).toISOString(),
    checkOutTime: new Date(Date.now() - 82800000).toISOString(),
    status: "completed",
    durationHours: 1,
    amount: 250,
    paymentStatus: "completed",
  },
  {
    id: "res-005",
    slotLabel: "A-025",
    slotType: "standard",
    userEmail: "alex@example.com",
    reservationDate: new Date().toISOString(),
    status: "active",
    durationHours: 2,
    amount: 500,
    paymentStatus: "completed",
  },
];

export default function ReservationReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const filteredReservations = useMemo(() => {
    return MOCK_RESERVATIONS.filter((res) => {
      const matchesSearch =
        res.slotLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || res.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || res.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchTerm, statusFilter, paymentFilter]);

  const stats = useMemo(() => {
    const completed = filteredReservations.filter((r) => r.status === "completed").length;
    const active = filteredReservations.filter((r) => r.status === "active").length;
    const totalRevenue = filteredReservations
      .filter((r) => r.paymentStatus === "completed")
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { completed, active, totalRevenue };
  }, [filteredReservations]);

  const handleExportCSV = () => {
    const headers = ["ID", "Slot", "Type", "User Email", "Date", "Status", "Duration (h)", "Amount", "Payment"];
    const rows = filteredReservations.map((r) => [
      r.id,
      r.slotLabel,
      r.slotType,
      r.userEmail || "-",
      format(new Date(r.reservationDate), "MMM dd, yyyy"),
      r.status,
      r.durationHours,
      r.amount ? `₹${r.amount}` : "-",
      r.paymentStatus,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservation-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "active":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700";
      case "failed":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl pb-20">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Reservation Report</h1>
        <p className="text-muted-foreground">View and manage all parking reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">₹{(stats.totalRevenue / 100).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Slot, Email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Payment</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger data-testid="select-payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="w-full"
                data-testid="button-export"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reservations ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} data-testid={`row-reservation-${reservation.id}`}>
                      <TableCell className="font-mono text-sm">{reservation.id}</TableCell>
                      <TableCell className="font-bold">{reservation.slotLabel}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {reservation.slotType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{reservation.userEmail || "-"}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(reservation.reservationDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center">{reservation.durationHours}h</TableCell>
                      <TableCell className="font-semibold">
                        {reservation.amount ? `₹${(reservation.amount / 100).toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize border ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`capitalize ${getPaymentColor(reservation.paymentStatus)}`}
                        >
                          {reservation.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No reservations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
