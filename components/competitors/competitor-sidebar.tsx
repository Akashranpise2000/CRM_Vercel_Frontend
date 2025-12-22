'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit3, Save, X, TrendingUp, Users, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { Competitor } from '@/types';

interface CompetitorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  competitors: Competitor[];
  onAddCompetitor: (competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateCompetitor: (id: string, competitor: Partial<Competitor>) => void;
  onDeleteCompetitor: (id: string) => void;
}

export function CompetitorSidebar({
  isOpen,
  onClose,
  competitors,
  onAddCompetitor,
  onUpdateCompetitor,
  onDeleteCompetitor
}: CompetitorSidebarProps) {
  const [expandedCompetitors, setExpandedCompetitors] = useState<Set<string>>(new Set());
  const [editingCompetitor, setEditingCompetitor] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Competitor>>({
    name: '',
    strength: '',
    weakness: '',
    positionVsYou: '',
    status: 'Equal',
    marketShare: 0,
    pricingModel: '',
    keyFeatures: '',
    customerBase: '',
    recentDevelopments: ''
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCompetitors);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCompetitors(newExpanded);
  };

  const startEditing = (competitor: Competitor) => {
    setEditingCompetitor(competitor.id || '');
    setFormData({ ...competitor });
  };

  const cancelEditing = () => {
    setEditingCompetitor(null);
    setFormData({
      name: '',
      strength: '',
      weakness: '',
      positionVsYou: '',
      status: 'Equal',
      marketShare: 0,
      pricingModel: '',
      keyFeatures: '',
      customerBase: '',
      recentDevelopments: ''
    });
  };

  const saveCompetitor = () => {
    if (!formData.name?.trim()) return;

    if (editingCompetitor) {
      onUpdateCompetitor(editingCompetitor, formData);
    } else {
      onAddCompetitor(formData as Omit<Competitor, 'id' | 'created_at' | 'updated_at'>);
    }

    cancelEditing();
    setIsAddingNew(false);
  };

  const startAddingNew = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      strength: '',
      weakness: '',
      positionVsYou: '',
      status: 'Equal',
      marketShare: 0,
      pricingModel: '',
      keyFeatures: '',
      customerBase: '',
      recentDevelopments: ''
    });
  };

  const cancelAdding = () => {
    setIsAddingNew(false);
    cancelEditing();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Superior': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Inferior': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Superior': return <TrendingUp className="h-3 w-3" />;
      case 'Inferior': return <Users className="h-3 w-3" />;
      default: return <DollarSign className="h-3 w-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          Competitors
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Add New Competitor Button */}
        {!isAddingNew && !editingCompetitor && (
          <div className="p-4 border-b">
            <Button onClick={startAddingNew} className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAddingNew || editingCompetitor) && (
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {editingCompetitor ? 'Edit Competitor' : 'Add New Competitor'}
              </h3>
              <div className="flex gap-2">
                <Button size="sm" onClick={saveCompetitor} disabled={!formData.name?.trim()}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={cancelAdding}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Competitor Name *</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter competitor name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status || 'Equal'}
                  onValueChange={(value: 'Equal' | 'Superior' | 'Inferior') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equal">Equal</SelectItem>
                    <SelectItem value="Superior">Superior</SelectItem>
                    <SelectItem value="Inferior">Inferior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Market Share (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marketShare || 0}
                  onChange={(e) => setFormData({ ...formData, marketShare: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Strength</label>
                <Textarea
                  value={formData.strength || ''}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  placeholder="What are they good at?"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Weakness</label>
                <Textarea
                  value={formData.weakness || ''}
                  onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                  placeholder="What are they weak at?"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Position vs You</label>
                <Textarea
                  value={formData.positionVsYou || ''}
                  onChange={(e) => setFormData({ ...formData, positionVsYou: e.target.value })}
                  placeholder="How do they compare to your company?"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Pricing Model</label>
                <Textarea
                  value={formData.pricingModel || ''}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                  placeholder="Describe their pricing strategy"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Key Features</label>
                <Textarea
                  value={formData.keyFeatures || ''}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  placeholder="List their notable features or products"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Customer Base</label>
                <Textarea
                  value={formData.customerBase || ''}
                  onChange={(e) => setFormData({ ...formData, customerBase: e.target.value })}
                  placeholder="Outline their target customers"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Recent Developments</label>
                <Textarea
                  value={formData.recentDevelopments || ''}
                  onChange={(e) => setFormData({ ...formData, recentDevelopments: e.target.value })}
                  placeholder="Any recent news, updates, or changes"
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Competitors List */}
        <div className="p-4 space-y-2">
          {competitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No competitors added yet</p>
            </div>
          ) : (
            competitors.map((competitor) => (
              <Card key={competitor.id} className="overflow-hidden">
                <Collapsible
                  open={expandedCompetitors.has(competitor.id || '')}
                  onOpenChange={() => toggleExpanded(competitor.id || '')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedCompetitors.has(competitor.id || '') ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <CardTitle className="text-sm">{competitor.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={cn("text-xs", getStatusColor(competitor.status))}>
                                {getStatusIcon(competitor.status)}
                                <span className="ml-1">{competitor.status}</span>
                              </Badge>
                              {competitor.marketShare && competitor.marketShare > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {competitor.marketShare}% market share
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(competitor);
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (competitor.id) onDeleteCompetitor(competitor.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0 space-y-3">
                      {competitor.strength && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Strength</label>
                          <p className="text-sm mt-1">{competitor.strength}</p>
                        </div>
                      )}

                      {competitor.weakness && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Weakness</label>
                          <p className="text-sm mt-1">{competitor.weakness}</p>
                        </div>
                      )}

                      {competitor.positionVsYou && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Position vs You</label>
                          <p className="text-sm mt-1">{competitor.positionVsYou}</p>
                        </div>
                      )}

                      {competitor.pricingModel && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Pricing Model</label>
                          <p className="text-sm mt-1">{competitor.pricingModel}</p>
                        </div>
                      )}

                      {competitor.keyFeatures && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Key Features</label>
                          <p className="text-sm mt-1">{competitor.keyFeatures}</p>
                        </div>
                      )}

                      {competitor.customerBase && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Customer Base</label>
                          <p className="text-sm mt-1">{competitor.customerBase}</p>
                        </div>
                      )}

                      {competitor.recentDevelopments && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Recent Developments</label>
                          <p className="text-sm mt-1">{competitor.recentDevelopments}</p>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}