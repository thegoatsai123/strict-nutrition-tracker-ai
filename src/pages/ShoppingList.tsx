
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ShoppingList {
  id: string;
  name: string;
  is_completed: boolean;
  created_at: string;
}

interface ShoppingListItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  category: string;
  is_purchased: boolean;
}

const ShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItem, setNewItem] = useState({
    item_name: '',
    quantity: '1',
    unit: 'item',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadShoppingLists();
    }
  }, [user]);

  const loadShoppingLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShoppingLists(data || []);
      
      if (data && data.length > 0 && !activeList) {
        setActiveList(data[0]);
        loadShoppingListItems(data[0].id);
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  };

  const loadShoppingListItems = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('shopping_list_id', listId)
        .order('is_purchased')
        .order('category')
        .order('item_name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading shopping list items:', error);
    }
  };

  const createShoppingList = async () => {
    if (!user || !newListName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a list name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          user_id: user.id,
          name: newListName.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setNewListName('');
      await loadShoppingLists();
      setActiveList(data);
      setItems([]);
      
      toast({
        title: "Shopping list created!",
        description: "Your new shopping list is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating shopping list",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!activeList || !newItem.item_name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an item name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .insert({
          shopping_list_id: activeList.id,
          item_name: newItem.item_name.trim(),
          quantity: parseFloat(newItem.quantity) || 1,
          unit: newItem.unit,
          category: newItem.category.trim() || null
        });

      if (error) throw error;

      setNewItem({
        item_name: '',
        quantity: '1',
        unit: 'item',
        category: ''
      });

      await loadShoppingListItems(activeList.id);
      toast({
        title: "Item added!",
        description: "Item has been added to your shopping list.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItemPurchased = async (itemId: string, isPurchased: boolean) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_purchased: isPurchased })
        .eq('id', itemId);

      if (error) throw error;

      if (activeList) {
        await loadShoppingListItems(activeList.id);
      }
    } catch (error: any) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      if (activeList) {
        await loadShoppingListItems(activeList.id);
      }

      toast({
        title: "Item removed",
        description: "Item has been removed from your shopping list.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const purchasedCount = items.filter(item => item.is_purchased).length;
  const completionPercentage = items.length > 0 ? Math.round((purchasedCount / items.length) * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Shopping Lists
        </h1>
      </div>

      {/* Create New List */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Shopping List</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="List name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createShoppingList()}
          />
          <Button onClick={createShoppingList} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </CardContent>
      </Card>

      {/* Shopping Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Lists</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppingLists.length === 0 ? (
              <p className="text-muted-foreground">No shopping lists yet.</p>
            ) : (
              <div className="space-y-2">
                {shoppingLists.map((list) => (
                  <div
                    key={list.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      activeList?.id === list.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setActiveList(list);
                      loadShoppingListItems(list.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{list.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(list.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {list.is_completed && <Badge variant="secondary">Completed</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active List Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{activeList?.name || 'Select a list'}</span>
              {activeList && (
                <Badge variant="outline">
                  {purchasedCount}/{items.length} ({completionPercentage}%)
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeList && (
              <>
                {/* Add Item */}
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="Item name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                  <Input
                    placeholder="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  />
                  <Button onClick={addItem} disabled={loading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No items in this list yet. Add some items above!
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          item.is_purchased ? 'bg-muted opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={item.is_purchased}
                            onCheckedChange={(checked) => 
                              toggleItemPurchased(item.id, checked as boolean)
                            }
                          />
                          <div>
                            <div className={`font-medium ${item.is_purchased ? 'line-through' : ''}`}>
                              {item.item_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit}
                              {item.category && ` • ${item.category}`}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShoppingList;
