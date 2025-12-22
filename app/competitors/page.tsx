"use client";

import { useState, useEffect } from "react";
import { useCRMStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, Users, DollarSign } from "lucide-react";
import { CompetitorSidebar } from "@/components/competitors/competitor-sidebar";
import type { Competitor } from "@/types";

export default function CompetitorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const competitors = useCRMStore((state) => state.competitors);
  const fetchCompetitors = useCRMStore((state) => state.fetchCompetitors);
  const addCompetitor = useCRMStore((state) => state.addCompetitor);
  const updateCompetitor = useCRMStore((state) => state.updateCompetitor);
  const deleteCompetitor = useCRMStore((state) => state.deleteCompetitor);

  useEffect(() => {
    fetchCompetitors();
  }, [fetchCompetitors]);

  const handleAddCompetitor = async (competitor: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addCompetitor(competitor);
    } catch (error) {
      console.error('Failed to add competitor:', error);
    }
  };

  const handleUpdateCompetitor = async (id: string, updates: Partial<Competitor>) => {
    try {
      await updateCompetitor(id, updates);
    } catch (error) {
      console.error('Failed to update competitor:', error);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this competitor?')) {
      try {
        await deleteCompetitor(id);
      } catch (error) {
        console.error('Failed to delete competitor:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Competitors</h1>
                <p className="text-slate-600 mt-1">Track and analyze your market competition</p>
              </div>
            </div>

            <Button onClick={() => setSidebarOpen(true)} className="bg-orange-600 hover:bg-orange-700">
              <Zap className="h-4 w-4 mr-2" />
              Manage Competitors
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Competitors</p>
                    <p className="text-2xl font-bold text-slate-900">{competitors.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Superior</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {competitors.filter(c => c.status === 'Superior').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Inferior</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {competitors.filter(c => c.status === 'Inferior').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Equal</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {competitors.filter(c => c.status === 'Equal').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Competitors Grid */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Competitor Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {competitors.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No competitors added yet.</p>
                <Button onClick={() => setSidebarOpen(true)} variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Add Your First Competitor
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitors.map((competitor) => (
                  <Card key={competitor.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          competitor.status === 'Superior' ? 'bg-red-100 text-red-800' :
                          competitor.status === 'Inferior' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {competitor.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {competitor.marketShare && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Market Share:</span>
                          <span className="font-medium">{competitor.marketShare}%</span>
                        </div>
                      )}
                      {competitor.strength && (
                        <div>
                          <p className="text-sm text-slate-600">Strength:</p>
                          <p className="text-sm">{competitor.strength}</p>
                        </div>
                      )}
                      {competitor.weakness && (
                        <div>
                          <p className="text-sm text-slate-600">Weakness:</p>
                          <p className="text-sm">{competitor.weakness}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Competitor Sidebar */}
      <CompetitorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        competitors={competitors}
        onAddCompetitor={handleAddCompetitor}
        onUpdateCompetitor={handleUpdateCompetitor}
        onDeleteCompetitor={handleDeleteCompetitor}
      />
    </div>
  );
}