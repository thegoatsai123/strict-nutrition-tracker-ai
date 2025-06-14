
import Navbar from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUp, User } from 'lucide-react';
import { dummyCommunityPosts, dummyCommunityStats, dummyFeaturedMember } from '@/data/dummyData';

const Community = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'progress': return 'bg-green-100 text-green-800';
      case 'recipes': return 'bg-blue-100 text-blue-800';
      case 'questions': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-2">Connect with others on their health journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Posts</CardTitle>
                  <Button>New Post</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {dummyCommunityPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{post.timeAgo}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-green-600">
                            <ArrowUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="hover:text-blue-600">
                            {post.comments} comments
                          </button>
                          <button className="hover:text-gray-700">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Active Members</span>
                  <span className="text-sm font-bold">{dummyCommunityStats.activeMembers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Posts This Week</span>
                  <span className="text-sm font-bold">{dummyCommunityStats.postsThisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Success Stories</span>
                  <span className="text-sm font-bold">{dummyCommunityStats.successStories.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Badge className="bg-green-100 text-green-800 mr-2">Progress</Badge>
                  Success Stories
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Badge className="bg-blue-100 text-blue-800 mr-2">Recipes</Badge>
                  Recipe Sharing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Badge className="bg-yellow-100 text-yellow-800 mr-2">Questions</Badge>
                  Help & Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Badge className="bg-purple-100 text-purple-800 mr-2">Motivation</Badge>
                  Daily Motivation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={dummyFeaturedMember.avatar} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{dummyFeaturedMember.name}</h4>
                    <p className="text-sm text-gray-600">{dummyFeaturedMember.achievement}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  "{dummyFeaturedMember.story}"
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Read Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
