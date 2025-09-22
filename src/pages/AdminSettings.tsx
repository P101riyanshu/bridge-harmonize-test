import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Users, 
  Bell, 
  Database, 
  Shield, 
  Mail,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState([
    { id: '1', name: 'John Admin', email: 'admin@demo.com', role: 'admin', department: '', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@demo.com', role: 'department', department: 'Public Works', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@demo.com', role: 'citizen', department: '', status: 'active' },
  ]);
  const [departments, setDepartments] = useState([
    { id: '1', name: 'Public Works', description: 'Roads, bridges, and infrastructure', head: 'Jane Smith', email: 'publicworks@city.gov' },
    { id: '2', name: 'Transportation', description: 'Traffic, parking, and transit', head: 'Mike Johnson', email: 'transport@city.gov' },
    { id: '3', name: 'Health & Sanitation', description: 'Public health and waste management', head: 'Sarah Davis', email: 'health@city.gov' },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'citizen',
    department: '',
  });

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    head: '',
    email: '',
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Civic Grievance Portal',
    maxFileSize: '10',
    autoAssignment: true,
    emailNotifications: true,
    smsNotifications: false,
    publicRegistration: true,
    moderateComments: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "System settings have been updated successfully.",
    });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: Date.now().toString(),
      ...newUser,
      status: 'active',
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'citizen', department: '' });
    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.email) {
      toast({
        title: "Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const department = {
      id: Date.now().toString(),
      ...newDepartment,
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: '', description: '', head: '', email: '' });
    toast({
      title: "Department added",
      description: `${newDepartment.name} department has been created.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User deleted",
      description: "User has been removed from the system.",
    });
  };

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(departments.filter(d => d.id !== deptId));
    toast({
      title: "Department deleted",
      description: "Department has been removed from the system.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration, users, and departments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxFileSize: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Assignment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign grievances to departments
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoAssignment}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoAssignment: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow citizens to register themselves
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.publicRegistration}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, publicRegistration: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Moderate Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Require approval for citizen comments
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.moderateComments}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, moderateComments: checked })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">Add, edit, and manage system users</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userRole">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="department">Department Officer</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.role === 'department' && (
                    <div className="space-y-2">
                      <Label htmlFor="userDepartment">Department</Label>
                      <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button onClick={handleAddUser} className="w-full">
                    Add User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'department' ? 'secondary' : 'outline'}>
                          {user.role.toUpperCase()}
                        </Badge>
                        {user.status === 'active' && <Badge variant="default">Active</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.department && (
                        <p className="text-sm text-muted-foreground">{user.department}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Department Management</h3>
              <p className="text-sm text-muted-foreground">Manage departments and their settings</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>
                    Create a new department in the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deptName">Department Name</Label>
                    <Input
                      id="deptName"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deptDescription">Description</Label>
                    <Textarea
                      id="deptDescription"
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deptHead">Department Head</Label>
                    <Input
                      id="deptHead"
                      value={newDepartment.head}
                      onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deptEmail">Email</Label>
                    <Input
                      id="deptEmail"
                      type="email"
                      value={newDepartment.email}
                      onChange={(e) => setNewDepartment({ ...newDepartment, email: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddDepartment} className="w-full">
                    Add Department
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Head: {dept.head}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{dept.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how the system sends notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email updates for grievance status changes
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS updates for urgent grievances
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.smsNotifications}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, smsNotifications: checked })}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Email Templates</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Grievance Submitted Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Status Update Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Resolution Template
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;