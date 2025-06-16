
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MealSharing } from '@/components/Community/MealSharing';
import { NutritionChallenges } from '@/components/Community/NutritionChallenges';
import { Users, Share2, Trophy, MessageSquare, Heart, Plus, Search, Filter, TrendingUp } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

const Community = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock community posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      content: 'Just hit my protein goal for 30 days straight! 💪 The key was meal prepping on Sundays and always having protein snacks ready.',
      likes: 24,
      comments: 8,
      timestamp: '2 hours ago',
      category: 'achievement'
    },
    {
      id: '2',
      author: 'Mike Johnson',
      content: 'Found an amazing recipe for quinoa bowls that are both delicious and macro-friendly. Anyone want the recipe?',
      image: '/placeholder.svg',
      likes: 18,
      comments: 12,
      timestamp: '4 hours ago',
      category: 'recipe'
    },
    {
      id: '3',
      author: 'Emma Davis',
      content: 'Week 3 of my weight loss journey and down 4 pounds! This community has been so supportive. Thank you all! 🙏',
      likes: 31,
      comments: 15,
      timestamp: '6 hours ago',
      category: 'progress'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'achievement', name: 'Achievements', count: 1 },
    { id: 'recipe', name: 'Recipes', count: 1 },
    { id: 'progress', name: 'Progress', count: 1 },
    { id: 'question', name: 'Questions', count: 0 }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        author: 'You',
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        category: 'general'
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Community
          </h1>
          <p className="text-muted-foreground mt-1">Connect, share, and grow together</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          1.2k Active Members
        </Badge>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Community Feed
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Meal Sharing
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">New Posts</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Achievements Shared</span>
                    <span className="font-medium">6</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Create Post */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share with the Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Share your progress, ask a question, or inspire others..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Add Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        Tag Achievement
                      </Button>
                    </div>
                    <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search posts..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{post.author}</p>
                              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                            </div>
                            {post.category !== 'general' && (
                              <Badge variant="secondary" className="capitalize">
                                {post.category}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm leading-relaxed">{post.content}</p>
                          
                          {post.image && (
                            <div className="rounded-lg overflow-hidden">
                              <img 
                                src={post.image} 
                                alt="Post image" 
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline">
                  Load More Posts
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="meals" className="space-y-6">
          <MealSharing />
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-6">
          <NutritionChallenges />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
