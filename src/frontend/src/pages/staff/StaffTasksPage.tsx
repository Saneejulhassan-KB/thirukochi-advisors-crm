import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { KPICard } from "@/components/shared/KPICard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type TaskStatus = "pending" | "in_progress" | "completed";
type TaskPriority = "high" | "medium" | "low";
type TaskCategory = "call" | "visit" | "follow-up" | "document" | "other";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  isPersonal: boolean;
  assignedBy?: string;
  notes?: string;
}

interface TargetItem {
  id: string;
  title: string;
  goal: number;
  achieved: number;
  unit: string;
  deadline: string;
  isPersonal: boolean;
}

const DUMMY_TASKS: Task[] = [
  {
    id: "T001",
    title: "Call Sreekumar Pillai for loan follow-up",
    description: "Discuss gold loan terms and documentation requirements",
    dueDate: "2026-05-22",
    priority: "high",
    category: "call",
    status: "pending",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T002",
    title: "Visit Meera Babu for document collection",
    description: "Collect KYC documents and income proof for business loan",
    dueDate: "2026-05-22",
    priority: "high",
    category: "visit",
    status: "in_progress",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T003",
    title: "Update EMI records for May batch",
    description: "Enter all May EMI payments into the system",
    dueDate: "2026-05-23",
    priority: "medium",
    category: "document",
    status: "pending",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T004",
    title: "Follow up with Divya Suresh on personal loan",
    description: "Check if she has decided on loan amount",
    dueDate: "2026-05-21",
    priority: "high",
    category: "follow-up",
    status: "completed",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T005",
    title: "Attend weekly team meeting",
    description: "Branch performance review and target discussion",
    dueDate: "2026-05-24",
    priority: "medium",
    category: "other",
    status: "pending",
    isPersonal: false,
    assignedBy: "Zonal Manager",
  },
  {
    id: "T006",
    title: "Prepare customer report for April",
    description: "Compile monthly customer interaction report",
    dueDate: "2026-05-20",
    priority: "low",
    category: "document",
    status: "completed",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T007",
    title: "Self-learning: IRDAI insurance module",
    description: "Complete online certification for insurance products",
    dueDate: "2026-05-28",
    priority: "low",
    category: "other",
    status: "pending",
    isPersonal: true,
  },
  {
    id: "T008",
    title: "Update personal CRM notes",
    description: "Log all customer interactions from this week",
    dueDate: "2026-05-22",
    priority: "medium",
    category: "document",
    status: "in_progress",
    isPersonal: true,
  },
  {
    id: "T009",
    title: "Prepare Thrissur branch visit report",
    description: "Summary of customer visits during Thrissur trip",
    dueDate: "2026-05-25",
    priority: "medium",
    category: "document",
    status: "pending",
    isPersonal: true,
  },
  {
    id: "T010",
    title: "Review George Thomas home loan file",
    description: "Check documents and run credit eligibility",
    dueDate: "2026-05-23",
    priority: "high",
    category: "document",
    status: "pending",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T011",
    title: "Send payment reminder to Rajeev",
    description: "Call and send WhatsApp reminder for EMI due",
    dueDate: "2026-05-22",
    priority: "high",
    category: "call",
    status: "in_progress",
    isPersonal: false,
    assignedBy: "Branch Manager",
  },
  {
    id: "T012",
    title: "Plan June prospecting calls",
    description: "Build list of new prospects for June cold calling",
    dueDate: "2026-05-29",
    priority: "low",
    category: "call",
    status: "pending",
    isPersonal: true,
  },
];

const DUMMY_TARGETS: TargetItem[] = [
  {
    id: "TR001",
    title: "Monthly Loan Disbursals",
    goal: 10,
    achieved: 7,
    unit: "disbursals",
    deadline: "2026-05-31",
    isPersonal: false,
  },
  {
    id: "TR002",
    title: "New Customer Acquisition",
    goal: 15,
    achieved: 9,
    unit: "customers",
    deadline: "2026-05-31",
    isPersonal: false,
  },
  {
    id: "TR003",
    title: "EMI Collection Rate",
    goal: 95,
    achieved: 88,
    unit: "%",
    deadline: "2026-05-31",
    isPersonal: false,
  },
  {
    id: "TR004",
    title: "Personal Lead Generation",
    goal: 20,
    achieved: 15,
    unit: "leads",
    deadline: "2026-05-31",
    isPersonal: true,
  },
];

const PRIORITY_CFG: Record<TaskPriority, { label: string; className: string }> =
  {
    high: {
      label: "High",
      className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
    medium: {
      label: "Medium",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    low: {
      label: "Low",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
  };

const STATUS_CFG: Record<
  TaskStatus,
  { label: string; next: TaskStatus; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    next: "in_progress",
    icon: <Clock className="w-3 h-3" />,
  },
  in_progress: {
    label: "In Progress",
    next: "completed",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  completed: {
    label: "Completed",
    next: "pending",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function TaskCard({
  task,
  onStatusChange,
  onClick,
}: { task: Task; onStatusChange: (id: string) => void; onClick: () => void }) {
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.status !== "completed" && task.dueDate < today;
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-4 cursor-pointer transition-smooth hover:border-primary/30",
        isOverdue ? "border-red-500/30" : "border-border",
      )}
      data-ocid={`tasks.task_card.${task.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={cn(
                "font-medium text-sm",
                task.status === "completed" &&
                  "line-through text-muted-foreground",
              )}
            >
              {task.title}
            </p>
            {isOverdue && (
              <Badge
                variant="outline"
                className="text-xs bg-red-500/10 text-red-600 border-red-500/20"
              >
                Overdue
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {task.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn("text-xs", PRIORITY_CFG[task.priority].className)}
            >
              {PRIORITY_CFG[task.priority].label}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", STATUS_BADGE[task.status])}
            >
              {task.status.replace("_", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {task.category}
            </span>
            <span className="text-xs text-muted-foreground">
              Due: {task.dueDate}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id);
          }}
          data-ocid={`tasks.status_toggle.${task.id}`}
        >
          {STATUS_CFG[task.status].icon}
          <span className="ml-1">
            {STATUS_CFG[STATUS_CFG[task.status].next].label}
          </span>
        </Button>
      </div>
    </motion.div>
  );
}

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [targets] = useState<TargetItem[]>(DUMMY_TARGETS);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const [newTask, setNewTask] = useState<Partial<Task>>({
    priority: "medium",
    category: "call",
    status: "pending",
    isPersonal: true,
  });

  const today = new Date().toISOString().split("T")[0];

  const summary = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status !== "completed" && t.dueDate < today)
      .length,
  };

  const advanceStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: STATUS_CFG[t.status].next } : t,
      ),
    );
  };

  const applyFilters = (list: Task[]) =>
    list.filter((t) => {
      const ms = !filterStatus || t.status === filterStatus;
      const mp = !filterPriority || t.priority === filterPriority;
      return ms && mp;
    });

  const handleAddTask = () => {
    const id = `T${String(tasks.length + 1).padStart(3, "0")}`;
    setTasks((prev) => [{ ...(newTask as Task), id }, ...prev]);
    setShowAddTask(false);
    setNewTask({
      priority: "medium",
      category: "call",
      status: "pending",
      isPersonal: true,
    });
  };

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <AppLayout>
        <div className="p-6 space-y-6">
          <PageHeader
            title="Tasks & Targets"
            subtitle="Manage your assigned and personal tasks, track your targets"
            actions={[
              {
                label: "Add Task",
                onClick: () => setShowAddTask(true),
                icon: <Plus className="w-4 h-4" />,
              },
            ]}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Tasks"
              value={summary.total}
              icon={<ListTodo className="w-5 h-5" />}
              iconColor="text-primary"
            />
            <KPICard
              title="Completed"
              value={summary.completed}
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconColor="text-emerald-500"
              trend="up"
            />
            <KPICard
              title="Pending"
              value={summary.pending}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-yellow-500"
            />
            <KPICard
              title="Overdue"
              value={summary.overdue}
              icon={<AlertCircle className="w-5 h-5" />}
              iconColor="text-red-500"
              trend="down"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
              data-ocid="tasks.filter_status_select"
            >
              <option value="">Status: All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter by priority"
              data-ocid="tasks.filter_priority_select"
            >
              <option value="">Priority: All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <Tabs defaultValue="assigned" data-ocid="tasks.tabs">
            <TabsList>
              <TabsTrigger value="assigned" data-ocid="tasks.assigned_tab">
                Assigned Tasks (
                {applyFilters(tasks.filter((t) => !t.isPersonal)).length})
              </TabsTrigger>
              <TabsTrigger value="personal" data-ocid="tasks.personal_tab">
                My Tasks (
                {applyFilters(tasks.filter((t) => t.isPersonal)).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="mt-4 space-y-3">
              {applyFilters(tasks.filter((t) => !t.isPersonal)).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={advanceStatus}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </TabsContent>

            <TabsContent value="personal" className="mt-4 space-y-3">
              {applyFilters(tasks.filter((t) => t.isPersonal)).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={advanceStatus}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </TabsContent>
          </Tabs>

          {/* Targets Section */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Targets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {targets.map((t, i) => {
                const pct = Math.min(
                  100,
                  Math.round((t.achieved / t.goal) * 100),
                );
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-border bg-card p-4"
                    data-ocid={`tasks.target_card.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-foreground">
                        {t.title}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {t.isPersonal ? "Personal" : "Assigned"}
                      </Badge>
                    </div>
                    <div className="flex items-end justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {t.achieved} / {t.goal} {t.unit}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          pct >= 100
                            ? "text-emerald-500"
                            : pct >= 70
                              ? "text-primary"
                              : "text-yellow-500",
                        )}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: i * 0.1,
                        }}
                        className={cn(
                          "h-full rounded-full",
                          pct >= 100
                            ? "bg-emerald-500"
                            : pct >= 70
                              ? "bg-primary"
                              : "bg-yellow-500",
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Deadline: {t.deadline}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Add Task Modal */}
          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogContent
              className="max-w-md"
              data-ocid="tasks.add_task_dialog"
            >
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    placeholder="Task title"
                    value={newTask.title ?? ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    data-ocid="tasks.add_title_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    placeholder="Task description"
                    value={newTask.description ?? ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    data-ocid="tasks.add_desc_textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate ?? ""}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      data-ocid="tasks.add_date_input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Priority</Label>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as TaskPriority,
                        })
                      }
                      data-ocid="tasks.add_priority_select"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <select
                      className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      value={newTask.category}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          category: e.target.value as TaskCategory,
                        })
                      }
                      data-ocid="tasks.add_category_select"
                    >
                      <option value="call">Call</option>
                      <option value="visit">Visit</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="document">Document</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                  data-ocid="tasks.add_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.title || !newTask.dueDate}
                  data-ocid="tasks.add_submit_button"
                >
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Task Detail Modal */}
          {selectedTask && (
            <Dialog
              open={!!selectedTask}
              onOpenChange={() => setSelectedTask(null)}
            >
              <DialogContent data-ocid="tasks.task_detail_dialog">
                <DialogHeader>
                  <DialogTitle>{selectedTask.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        PRIORITY_CFG[selectedTask.priority].className,
                      )}
                    >
                      {PRIORITY_CFG[selectedTask.priority].label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        STATUS_BADGE[selectedTask.status],
                      )}
                    >
                      {selectedTask.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedTask.category}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Due Date:</span>{" "}
                      <span className="font-medium">
                        {selectedTask.dueDate}
                      </span>
                    </p>
                    {selectedTask.assignedBy && (
                      <p>
                        <span className="text-muted-foreground">
                          Assigned By:
                        </span>{" "}
                        <span className="font-medium">
                          {selectedTask.assignedBy}
                        </span>
                      </p>
                    )}
                    {selectedTask.notes && (
                      <p>
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        <span>{selectedTask.notes}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTask(null)}
                    data-ocid="tasks.detail_close_button"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
