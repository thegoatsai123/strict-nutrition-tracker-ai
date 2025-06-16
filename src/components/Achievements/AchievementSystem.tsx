
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'goal' | 'milestone' | 'social';
  progress: number;
  target: number;
  completed: boolean;
  points: number;
  unlockedAt?: Date;
}

export const AchievementSystem = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Log your first meal',
        icon: '🎯',
        category: 'milestone',
        progress: 1,
        target: 1,
        completed: true,
        points: 10,
        unlockedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Streak Master',
        description: 'Log meals for 7 consecutive days',
        icon: '🔥',
        category: 'streak',
        progress: 5,
        target: 7,
        completed: false,
        points: 50
      },
      {
        id: '3',
        name: 'Protein Champion',
        description: 'Meet your protein goal for 30 days',
        icon: '💪',
        category: 'goal',
        progress: 18,
        target: 30,
        completed: false,
        points: 100
      },
      {
        id: '4',
        name: 'Hydration Hero',
        description: 'Drink 8 glasses of water in a day',
        icon: '💧',
        category: 'goal',
        progress: 6,
        target: 8,
        completed: false,
        points: 25
      },
      {
        id: '5',
        name: 'Community Star',
        description: 'Get 10 likes on a shared meal',
        icon: '⭐',
        category: 'social',
        progress: 7,
        target: 10,
        completed: false,
        points: 30
      },
      {
        id: '6',
        name: 'Recipe Explorer',
        description: 'Try 25 new recipes',
        icon: '👨‍🍳',
        category: 'milestone',
        progress: 12,
        target: 25,
        completed: false,
        points: 75
      }
    ];

    setAchievements(mockAchievements);
    
    const points = mockAchievements
      .filter(a => a.completed)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(points);
    
    const level = Math.floor(points / 100) + 1;
    setCurrentLevel(level);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      case 'milestone': return <Award className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'streak': return 'text-orange-500';
      case 'goal': return 'text-blue-500';
      case 'milestone': return 'text-purple-500';
      case 'social': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const completedAchievements = achievements.filter(a => a.completed);
  const inProgressAchievements = achievements.filter(a => !a.completed);

  return (
    <div className="space-y-6">
      {/* User Level & Points */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <CardTitle className="text-2xl">Level {currentLevel}</CardTitle>
                <CardDescription>{totalPoints} Total Points</CardDescription>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(totalPoints % 100)} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {100 - (totalPoints % 100)} points until next level
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              Completed ({completedAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                  <p className="text-sm text-green-600">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-green-500 mt-1">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{achievement.points}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* In Progress Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              In Progress ({inProgressAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inProgressAchievements.map((achievement) => (
              <div key={achievement.id} className="space-y-3 p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={getCategoryColor(achievement.category)}>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <Badge variant="outline">
                      +{achievement.points}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.target}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.target) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
