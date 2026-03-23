import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddTransaction,
  useDeleteTransaction,
  useGetTransactions,
} from "@/hooks/useQueries";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  List,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const SAMPLE_TRANSACTIONS = [
  {
    id: -1,
    date: "2026-03-01",
    name: "Salary Deposit",
    amount: 5500.0,
    narration: "Monthly salary from Acme Corp",
  },
  {
    id: -2,
    date: "2026-03-03",
    name: "Office Rent",
    amount: -1200.0,
    narration: "March office space rental",
  },
  {
    id: -3,
    date: "2026-03-07",
    name: "Client Payment",
    amount: 2300.0,
    narration: "Invoice #INV-2047 from BrightTech",
  },
  {
    id: -4,
    date: "2026-03-10",
    name: "Software Subscriptions",
    amount: -349.0,
    narration: "Adobe Creative Cloud + Figma annual",
  },
  {
    id: -5,
    date: "2026-03-14",
    name: "Freelance Project",
    amount: 875.0,
    narration: "Website redesign for Maple Bakery",
  },
  {
    id: -6,
    date: "2026-03-18",
    name: "Utility Bills",
    amount: -215.5,
    narration: "Electricity + internet March",
  },
];

function formatAmount(amount: number) {
  const abs = Math.abs(amount).toFixed(2);
  return amount >= 0 ? `+$${abs}` : `-$${abs}`;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

type NavItem = { id: string; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "transactions", label: "All Transactions", icon: <List size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

function AddTransactionDrawer({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    date: "",
    name: "",
    amount: "",
    narration: "",
  });
  const addMutation = useAddTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.name || !form.amount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await addMutation.mutateAsync({
        date: form.date,
        name: form.name,
        amount: Number.parseFloat(form.amount),
        narration: form.narration,
      });
      toast.success("Transaction added successfully!");
      setForm({ date: "", name: "", amount: "", narration: "" });
      onClose();
    } catch {
      toast.error("Failed to add transaction. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            data-ocid="add_transaction.modal"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-modal z-50 flex flex-col"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Add New Transaction
              </h2>
              <button
                type="button"
                data-ocid="add_transaction.close_button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-y-auto px-6 py-6 gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="tx-date"
                  className="text-sm font-medium text-foreground"
                >
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tx-date"
                  data-ocid="add_transaction.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  required
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="tx-name"
                  className="text-sm font-medium text-foreground"
                >
                  Name / Payee <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tx-name"
                  data-ocid="add_transaction.input"
                  type="text"
                  placeholder="e.g. Salary Deposit"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="tx-amount"
                  className="text-sm font-medium text-foreground"
                >
                  Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tx-amount"
                  data-ocid="add_transaction.input"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 1500 or -350"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  required
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Use negative values for expenses (e.g. -350)
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="tx-narration"
                  className="text-sm font-medium text-foreground"
                >
                  Narration
                </Label>
                <Textarea
                  id="tx-narration"
                  data-ocid="add_transaction.textarea"
                  placeholder="Brief description of this transaction…"
                  value={form.narration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, narration: e.target.value }))
                  }
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>
              <div className="flex gap-3 mt-auto pt-4">
                <Button
                  type="submit"
                  data-ocid="add_transaction.submit_button"
                  disabled={addMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-brand-teal to-brand-green text-white font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  {addMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus size={16} />
                      Add Transaction
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  data-ocid="add_transaction.cancel_button"
                  variant="outline"
                  onClick={onClose}
                  className="px-5"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function KpiCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendLabel?: string;
  color: "teal" | "green" | "blue";
}) {
  const colorMap = {
    teal: "from-brand-teal/10 to-brand-teal/5 border-brand-teal/20",
    green: "from-brand-green/10 to-brand-green/5 border-brand-green/20",
    blue: "from-brand-blue/10 to-brand-blue/5 border-brand-blue/20",
  };
  const iconColorMap = {
    teal: "text-brand-teal bg-brand-teal/10",
    green: "text-brand-green bg-brand-green/10",
    blue: "text-brand-blue bg-brand-blue/10",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-card rounded-xl border shadow-card p-5 flex flex-col gap-3 bg-gradient-to-br ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        <span className={`rounded-lg p-2 ${iconColorMap[color]}`}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-muted-foreground">
            {trend} {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  const { data: backendTxs = [], isLoading } = useGetTransactions();
  const deleteMutation = useDeleteTransaction();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Merge sample + backend transactions
  const allTransactions = useMemo(() => {
    if (backendTxs.length > 0) return backendTxs;
    return SAMPLE_TRANSACTIONS;
  }, [backendTxs]);

  const totalIncome = useMemo(
    () =>
      allTransactions
        .filter((t) => t.amount > 0)
        .reduce((s, t) => s + t.amount, 0),
    [allTransactions],
  );
  const totalExpenses = useMemo(
    () =>
      allTransactions
        .filter((t) => t.amount < 0)
        .reduce((s, t) => s + Math.abs(t.amount), 0),
    [allTransactions],
  );
  const balance = totalIncome - totalExpenses;

  const filtered = useMemo(() => {
    if (!search.trim()) return allTransactions;
    const q = search.toLowerCase();
    return allTransactions.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.date.includes(q) ||
        t.narration.toLowerCase().includes(q) ||
        String(t.amount).includes(q),
    );
  }, [allTransactions, search]);

  const handleDelete = async (id: number) => {
    if (id < 0) {
      toast.info(
        "Sample transactions cannot be deleted. Add real transactions to manage them.",
      );
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Transaction deleted.");
    } catch {
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col h-full shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-green flex items-center justify-center">
            <Wallet size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            LedgerFlow
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors ${
                activeNav === item.id
                  ? "bg-brand-blue-light text-brand-blue"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LifeBuoy size={18} />
            Support
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="header.search_input"
              placeholder="Search transactions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background text-sm h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-9 w-9"
            >
              <Bell size={18} />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted cursor-pointer hover:bg-accent transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white text-xs font-bold">
                AJ
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                Alex Johnson
              </span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Page title + CTA */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Track and manage your financial transactions
              </p>
            </div>
            <Button
              data-ocid="dashboard.add_transaction.open_modal_button"
              onClick={() => setDrawerOpen(true)}
              className="bg-gradient-to-r from-brand-teal to-brand-green text-white font-semibold hover:opacity-90 transition-opacity shadow-sm gap-2"
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <KpiCard
              title="Total Income"
              value={`$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<TrendingUp size={18} />}
              color="green"
              trendLabel="this period"
            />
            <KpiCard
              title="Total Expenses"
              value={`$${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<TrendingDown size={18} />}
              color="teal"
              trendLabel="this period"
            />
            <KpiCard
              title="Current Balance"
              value={`$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<Wallet size={18} />}
              color="blue"
              trendLabel="net"
            />
          </div>

          {/* Transaction Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Transaction Ledger
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} entries
                </p>
              </div>
            </div>

            {isLoading ? (
              <div
                data-ocid="transactions.loading_state"
                className="p-5 space-y-3"
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pl-5">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Name / Payee
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Narration
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center pr-5">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div
                            data-ocid="transactions.empty_state"
                            className="flex flex-col items-center justify-center py-12 text-center"
                          >
                            <Wallet
                              size={36}
                              className="text-muted-foreground/40 mb-3"
                            />
                            <p className="text-sm font-medium text-muted-foreground">
                              No transactions found
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add your first transaction to get started
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((tx, idx) => (
                        <TableRow
                          key={tx.id}
                          data-ocid={`transactions.item.${idx + 1}`}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="text-sm text-foreground pl-5 py-3.5 whitespace-nowrap">
                            {formatDate(tx.date)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground py-3.5">
                            {tx.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground py-3.5 max-w-xs">
                            <span
                              className="truncate block max-w-[200px]"
                              title={tx.narration}
                            >
                              {tx.narration || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-right py-3.5 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`font-semibold ${
                                tx.amount >= 0
                                  ? "text-brand-green border-brand-green/30 bg-brand-green/5"
                                  : "text-destructive border-destructive/30 bg-destructive/5"
                              }`}
                            >
                              {formatAmount(tx.amount)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center py-3.5 pr-5">
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`transactions.delete_button.${idx + 1}`}
                              onClick={() => handleDelete(tx.id)}
                              disabled={deleteMutation.isPending}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </footer>
        </main>
      </div>

      {/* Add Transaction Drawer */}
      <AddTransactionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
