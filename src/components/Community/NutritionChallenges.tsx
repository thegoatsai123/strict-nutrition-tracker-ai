
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Target, Users, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'protein' | 'steps' | 'water' | 'vegetables' | 'streak';
  target_value: number;
  unit: string;
  duration_days: number;
  start_date: string;
  end_date: string;
  participants_count: number;
  reward_points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  is_joined: boolean;
  user_progress: number;
}

interface Leaderboard {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  progress: number;
  rank: number;
}

export const NutritionChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      // Mock data - in real app would fetch from Supabase
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: '30-Day Protein Challenge',
          description: 'Reach your daily protein goal for 30 consecutive days',
          type: 'protein',
          target_value: 30,
          unit: 'days',
          duration_days: 30,
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          participants_count: 156,
          reward_points: 500,
          difficulty: 'medium',
          is_joined: true,
          user_progress: 18
        },
        {
          id: '2',
          title: 'Hydration Hero',
          description: 'Drink at least 2.5L of water daily for 2 weeks',
          type: 'water',
          target_value: 14,
          unit: 'days',
          duration_days: 14,
          start_date: '2024-01-15',
          end_date: '2024-01-29',
          participants_count: 89,
          reward_points: 250,
          difficulty: 'easy',
          is_joined: false,
          user_progress: 0
        },
        {
          id: '3',
          title: 'Veggie Master',
          description: 'Eat 5 servings of vegetables daily for a week',
          type: 'vegetables',
          target_value: 7,
          unit: 'days',
          duration_days: 7,
          start_date: '2024-01-20',
          end_date: '2024-01-27',
          participants_count: 203,
          reward_points: 150,
          difficulty: 'hard',
          is_joined: true,
          user_progress: 3
        }
      ];

      setChallenges(mockChallenges);
      setActiveChallenge(mockChallenges[0]);
      
      // Mock leaderboard
      setLeaderboard([
        { user_id: '1', user_name: 'Alex Rivera', progress: 95, rank: 1 },
        { user_id: '2', user_name: 'Sarah Johnson', progress: 92, rank: 2 },
        { user_id: '3', user_name: 'Mike Chen', progress: 88, rank: 3 },
        { user_id: '4', user_name: 'Emma Wilson', progress: 85, rank: 4 },
        { user_id: '5', user_name: 'You', progress: 82, rank: 5 }
      ]);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      setChallenges(challenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, is_joined: true, participants_count: challenge.participants_count + 1 }
          : challenge
      ));
      
      toast({
        title: "Challenge joined!",
        description: "You've successfully joined the challenge. Good luck!",
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'protein': return <Target className="h-5 w-5" />;
      case 'water': return <TrendingUp className="h-5 w-5" />;
      case 'vegetables': return <Trophy className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Nutrition Challenges
        </h2>
        <Badge variant="outline" className="text-sm">
          {challenges.filter(c => c.is_joined).length} Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Challenges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Challenges</h3>
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getChallengeIcon(challenge.type)}
                    {challenge.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{challenge.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {challenge.duration_days} days
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {challenge.participants_count} joined
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {challenge.reward_points} points
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {challenge.target_value} {challenge.unit}
                  </div>
                </div>

                {challenge.is_joined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.user_progress}/{challenge.target_value}</span>
                    </div>
                    <Progress value={(challenge.user_progress / challenge.target_value) * 100} />
                  </div>
                )}

                <div className="flex gap-2">
                  {!challenge.is_joined ? (
                    <Button onClick={() => joinChallenge(challenge.id)} className="w-full">
                      Join Challenge
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Joined
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => setActiveChallenge(challenge)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Leaderboard</h3>
          {activeChallenge && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{activeChallenge.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div key={entry.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {entry.rank}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.user_avatar} />
                        <AvatarFallback>{entry.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{entry.user_name}</div>
                        <div className="text-sm text-muted-foreground">{entry.progress}% complete</div>
                      </div>
                      {entry.rank <= 3 && (
                        <Trophy className={`h-4 w-4 ${
                          entry.rank === 1 ? 'text-yellow-500' : 
                          entry.rank === 2 ? 'text-gray-400' : 
                          'text-orange-500'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
