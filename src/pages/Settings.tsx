
import Navbar from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
              </div>
              <Button>Update Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>Set your health goals and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="Enter your weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="Enter your height" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Daily Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calorieGoal">Calories</Label>
                    <Input id="calorieGoal" type="number" placeholder="2000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proteinGoal">Protein (g)</Label>
                    <Input id="proteinGoal" type="number" placeholder="150" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbGoal">Carbs (g)</Label>
                    <Input id="carbGoal" type="number" placeholder="250" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatGoal">Fat (g)</Label>
                    <Input id="fatGoal" type="number" placeholder="65" />
                  </div>
                </div>
              </div>

              <Button>Update Health Information</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="meal-reminders">Meal Reminders</Label>
                  <p className="text-sm text-gray-600">Get reminded to log your meals</p>
                </div>
                <Switch id="meal-reminders" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="goal-updates">Goal Updates</Label>
                  <p className="text-sm text-gray-600">Receive updates on your progress</p>
                </div>
                <Switch id="goal-updates" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="community">Community Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified about community activity</p>
                </div>
                <Switch id="community" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Receive weekly nutrition summaries</p>
                </div>
                <Switch id="weekly-reports" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Download Data</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
