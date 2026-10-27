import "./global.css";
import * as React from "react";
import { ScrollView, View, SafeAreaView, StatusBar, Pressable, Platform } from "react-native";
import {
  BeyondUIProvider,
  useBeyondUI,
  useToast,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarFallback,
  Switch,
  Checkbox,
  RadioGroup,
  Radio,
  Spinner,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
  Separator,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  StatsCard,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetClose,
  Select,
  DataTable,
  SignInTemplate,
  SignUpTemplate,
  DashboardTemplate,
  SettingsTemplate,
} from "@beyondcorp/beyond-ui-native";

function ComponentsShowcase() {
  const toast = useToast();

  const [inputVal, setInputVal] = React.useState("");
  const [switchVal, setSwitchVal] = React.useState(true);
  const [checkVal, setCheckVal] = React.useState(true);
  const [radioVal, setRadioVal] = React.useState("option1");
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("developer");

  const sampleTableData = [
    { id: "1", name: "Beyond Mobile SDK", version: "v1.2.0", status: "Active", downloads: 1420 },
    { id: "2", name: "Auth Service API", version: "v2.0.4", status: "Maintenance", downloads: 890 },
    { id: "3", name: "Cloud Sync Engine", version: "v0.9.8", status: "Beta", downloads: 310 },
    { id: "4", name: "Payment Gateway", version: "v3.1.1", status: "Active", downloads: 4520 },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      {/* Toast Triggers */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Toast Notifications
        </Heading>
        <View className="flex-row flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onPress={() => toast.success("Deployment finished successfully!")}
          >
            Success Toast
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onPress={() => toast.error("Server connection timeout")}
          >
            Error Toast
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={() => toast.warning("Battery below 15%")}
          >
            Warning Toast
          </Button>
        </View>
      </View>

      {/* Accordion */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Accordion
        </Heading>
        <Card className="p-4">
          <Accordion type="single" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Beyond UI Native?</AccordionTrigger>
              <AccordionContent>
                A high-performance React Native component library crafted by Beyond Softwares with NativeWind v4 and accessible compound primitives.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it compatible with Expo SDK 52?</AccordionTrigger>
              <AccordionContent>
                Yes! Fully tested and optimized for Expo SDK 52 with zero extra native compilation requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How does theming work?</AccordionTrigger>
              <AccordionContent>
                Theming is powered by Tailwind design tokens with full light/dark mode support and 50–950 shade scales.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </View>

      {/* Bottom Sheet */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Bottom Sheet Modal
        </Heading>
        <BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <BottomSheetTrigger asChild>
            <Button variant="primary" size="md">
              Open Bottom Sheet
            </Button>
          </BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Quick Actions</BottomSheetTitle>
              <BottomSheetDescription>
                Swipe down or tap outside to dismiss this interactive sheet.
              </BottomSheetDescription>
            </BottomSheetHeader>
            <BottomSheetBody className="gap-3">
              <Button
                variant="outline"
                size="md"
                onPress={() => {
                  toast.success("Action: Export Data");
                  setIsSheetOpen(false);
                }}
              >
                📊 Export Analytics Report
              </Button>
              <Button
                variant="outline"
                size="md"
                onPress={() => {
                  toast.info("Action: Invite Team");
                  setIsSheetOpen(false);
                }}
              >
                👥 Invite Organization Member
              </Button>
            </BottomSheetBody>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </BottomSheetClose>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </View>

      {/* Select Picker */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Select Picker
        </Heading>
        <Select
          label="Select Developer Role"
          placeholder="Choose your engineering role..."
          value={selectedRole}
          onValueChange={setSelectedRole}
          options={[
            { label: "Frontend Engineer", value: "frontend" },
            { label: "Mobile Engineer", value: "mobile" },
            { label: "Full Stack Engineer", value: "fullstack" },
            { label: "DevOps / SRE", value: "devops" },
          ]}
          searchable
        />
      </View>

      {/* Data Table / List */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Mobile Data Table / Cards
        </Heading>
        <DataTable
          columns={[
            { key: "name", title: "Project Name", sortable: true },
            { key: "version", title: "Version" },
            {
              key: "status",
              title: "Status",
              render: (val: string) => (
                <Badge
                  variant={val === "Active" ? "success" : val === "Beta" ? "primary" : "warning"}
                  size="sm"
                >
                  {val}
                </Badge>
              ),
            },
            { key: "downloads", title: "Downloads", sortable: true },
          ]}
          data={sampleTableData}
          pageSize={2}
          onRowPress={(item) => toast.info(`Selected: ${item.name}`)}
        />
      </View>

      {/* Stats Cards */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Stats Cards
        </Heading>
        <View className="gap-3">
          <StatsCard
            title="Active Mobile Users"
            value="42,850"
            trend={{ direction: "up", value: "+18.2%", label: "vs last month" }}
          />
          <StatsCard
            title="Avg Response Latency"
            value="124 ms"
            trend={{ direction: "down", value: "-12.4%", label: "faster" }}
          />
        </View>
      </View>

      {/* Buttons */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Buttons & States
        </Heading>
        <View className="gap-3">
          <View className="flex-row flex-wrap gap-2">
            <Button variant="primary" size="md">
              Primary
            </Button>
            <Button variant="secondary" size="md">
              Secondary
            </Button>
            <Button variant="destructive" size="md">
              Destructive
            </Button>
            <Button variant="outline" size="md">
              Outline
            </Button>
            <Button variant="ghost" size="md">
              Ghost
            </Button>
          </View>

          <Button
            variant="primary"
            size="lg"
            loading={btnLoading}
            onPress={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 2000);
            }}
          >
            {btnLoading ? "Processing..." : "Tap for Loading State"}
          </Button>
        </View>
      </View>

      {/* Inputs */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Input & Textarea
        </Heading>
        <View className="gap-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Beyond Cloud"
            value={inputVal}
            onChangeText={setInputVal}
            helperText="Enter your mobile project identifier"
          />
          <Textarea
            label="Description"
            placeholder="Tell us about your application..."
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Controls */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Switches, Checkboxes & Radios
        </Heading>
        <Card className="p-4 gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium">Push Notifications</Text>
            <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
          </View>
          <Separator />
          <View className="flex-row items-center gap-3">
            <Checkbox checked={checkVal} onCheckedChange={setCheckVal} />
            <Text className="text-sm font-medium">I agree to terms</Text>
          </View>
          <Separator />
          <RadioGroup value={radioVal} onValueChange={setRadioVal} className="gap-2">
            <View className="flex-row items-center gap-3">
              <Radio value="option1" />
              <Text className="text-sm">Standard Tier</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Radio value="option2" />
              <Text className="text-sm">Enterprise Tier</Text>
            </View>
          </RadioGroup>
        </Card>
      </View>

      {/* Dialog */}
      <View className="mb-6">
        <Heading level={4} className="mb-3">
          Accessible Dialog
        </Heading>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Confirmation Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Access Key?</DialogTitle>
              <DialogDescription>
                This will immediately invalidate any live mobile client sessions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="sm"
                onPress={() => {
                  setIsDialogOpen(false);
                  toast.success("Access key revoked.");
                }}
              >
                Confirm Revoke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    </ScrollView>
  );
}

function ShowcaseApp() {
  const { colorScheme, toggleColorScheme } = useBeyondUI();
  const [activeTab, setActiveTab] = React.useState<"components" | "auth" | "dashboard" | "settings">("components");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
      }}
      className="flex-1 bg-neutral-50 dark:bg-neutral-950"
    >
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      {/* Top Header & Navigation Bar */}
      <View className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <View className="flex-row items-center justify-between pb-3">
          <View>
            <Text className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Beyond Softwares
            </Text>
            <Heading level={3} className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50">
              Beyond UI Native
            </Heading>
          </View>
          <Button variant="outline" size="sm" onPress={toggleColorScheme}>
            {colorScheme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </View>

        {/* Tab Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pt-1">
          <View className="flex-row gap-2">
            <Button
              variant={activeTab === "components" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setActiveTab("components")}
            >
              Components
            </Button>
            <Button
              variant={activeTab === "auth" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setActiveTab("auth")}
            >
              Auth Template
            </Button>
            <Button
              variant={activeTab === "dashboard" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setActiveTab("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "settings" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setActiveTab("settings")}
            >
              Settings
            </Button>
          </View>
        </ScrollView>
      </View>

      {/* Active View */}
      <View style={{ flex: 1 }} className="flex-1">
        {activeTab === "components" && <ComponentsShowcase />}
        {activeTab === "auth" && (
          <SignInTemplate
            onSubmit={(data) => alert(`Signed in: ${data.email}`)}
            onForgotPassword={() => alert("Forgot password tapped")}
            onSignUpPress={() => alert("Sign up tapped")}
          />
        )}
        {activeTab === "dashboard" && (
          <DashboardTemplate
            userName="Mark"
            userRole="Principal Engineer"
            metrics={[
              {
                id: "1",
                title: "Total Revenue",
                value: "$84,200",
                trend: { direction: "up", value: "+22.4%", label: "this quarter" },
              },
              {
                id: "2",
                title: "Active Subscriptions",
                value: "1,240",
                trend: { direction: "up", value: "+8.1%", label: "growth" },
              },
            ]}
            quickActions={[
              { id: "1", label: "New Project", icon: "🚀", onPress: () => {} },
              { id: "2", label: "Analytics", icon: "📈", onPress: () => {} },
              { id: "3", label: "Export", icon: "💾", onPress: () => {} },
            ]}
            recentActivities={[
              {
                id: "1",
                title: "Stripe Payment Received",
                subtitle: "Enterprise Pro subscription",
                timestamp: "5m ago",
                amount: "+$499.00",
                status: { label: "Success", variant: "success" },
              },
              {
                id: "2",
                title: "Mobile App Deployed",
                subtitle: "iOS Production build 1.4.0",
                timestamp: "1h ago",
                status: { label: "Shipped", variant: "primary" },
              },
            ]}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTemplate
            user={{
              name: "Mark Otto",
              email: "mark@beyondsoftwares.com",
              plan: "Enterprise",
            }}
            isDarkMode={colorScheme === "dark"}
            onToggleDarkMode={() => toggleColorScheme()}
            onLogout={() => alert("Logged out")}
            onDeleteAccount={() => alert("Delete account tapped")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <BeyondUIProvider defaultColorScheme="system">
      <ShowcaseApp />
    </BeyondUIProvider>
  );
}
