import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, Tag, BookOpen, GitBranch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface ReleaseNoteFormData {
  version: string;
  title: string;
  description: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  category: 'feature' | 'improvement' | 'bugfix' | 'security';
  changes: Array<{
    description: string;
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  }>;
  isPublished: boolean;
}

export const ReleaseNotesManagement: React.FC = () => {
  const { releaseNotes, addReleaseNote, updateReleaseNote, deleteReleaseNote, publishReleaseNote } = useAdmin();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [viewingNote, setViewingNote] = useState<any>(null);

  const form = useForm<ReleaseNoteFormData>({
    defaultValues: {
      version: '',
      title: '',
      description: '',
      type: 'minor',
      category: 'feature',
      changes: [{ description: '', type: 'added' }],
      isPublished: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'changes',
  });

  const onSubmit = (data: ReleaseNoteFormData) => {
    try {
      const processedChanges = data.changes
        .filter(change => change.description.trim())
        .map((change, index) => ({
          id: `${Date.now()}_${index}`,
          ...change,
        }));

      if (editingNote) {
        updateReleaseNote(editingNote, {
          ...data,
          changes: processedChanges,
        });
        toast({ title: "Release note updated successfully" });
      } else {
        addReleaseNote({
          ...data,
          changes: processedChanges,
        });
        toast({ title: "Release note created successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingNote(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save release note", variant: "destructive" });
    }
  };

  const handleEdit = (note: any) => {
    setEditingNote(note.id);
    form.reset({
      version: note.version,
      title: note.title,
      description: note.description,
      type: note.type,
      category: note.category,
      changes: note.changes || [{ description: '', type: 'added' }],
      isPublished: note.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteReleaseNote(id);
      toast({ title: "Release note deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete release note", variant: "destructive" });
    }
  };

  const handlePublish = (id: string) => {
    try {
      publishReleaseNote(id);
      toast({ title: "Release note published successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish release note", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingNote(null);
    form.reset({
      version: '',
      title: '',
      description: '',
      type: 'minor',
      category: 'feature',
      changes: [{ description: '', type: 'added' }],
      isPublished: false,
    });
    setIsDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'destructive';
      case 'minor': return 'default';
      case 'patch': return 'secondary';
      case 'hotfix': return 'destructive';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'default';
      case 'improvement': return 'secondary';
      case 'bugfix': return 'destructive';
      case 'security': return 'destructive';
      default: return 'secondary';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added': return '✨';
      case 'changed': return '🔄';
      case 'deprecated': return '⚠️';
      case 'removed': return '🗑️';
      case 'fixed': return '🐛';
      case 'security': return '🔒';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Release Notes</h1>
          <p className="text-muted-foreground">Manage product updates and release communications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              New Release Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Release Note' : 'Create New Release Note'}</DialogTitle>
              <DialogDescription>
                {editingNote ? 'Update release note information' : 'Document new features, improvements, and bug fixes'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="changes">Changes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="version"
                        rules={{ required: "Version is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Version</FormLabel>
                            <FormControl>
                              <Input placeholder="1.0.0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Release Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="major">Major Release</SelectItem>
                                <SelectItem value="minor">Minor Release</SelectItem>
                                <SelectItem value="patch">Patch</SelectItem>
                                <SelectItem value="hotfix">Hotfix</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Title</FormLabel>
                          <FormControl>
                            <Input placeholder="New Features and Improvements" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="feature">New Feature</SelectItem>
                              <SelectItem value="improvement">Improvement</SelectItem>
                              <SelectItem value="bugfix">Bug Fix</SelectItem>
                              <SelectItem value="security">Security Update</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the main highlights of this release..." 
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Publish Immediately</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Make this release note visible to users
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="changes" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Changelog</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ description: '', type: 'added' })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Change
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-3 items-start p-3 border rounded-lg">
                          <div className="grid grid-cols-4 gap-3 flex-1">
                            <FormField
                              control={form.control}
                              name={`changes.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="added">Added</SelectItem>
                                      <SelectItem value="changed">Changed</SelectItem>
                                      <SelectItem value="deprecated">Deprecated</SelectItem>
                                      <SelectItem value="removed">Removed</SelectItem>
                                      <SelectItem value="fixed">Fixed</SelectItem>
                                      <SelectItem value="security">Security</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <div className="col-span-3">
                              <FormField
                                control={form.control}
                                name={`changes.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Describe the change..." {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNote ? 'Update' : 'Create'} Release Note
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Release Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Release Notes ({releaseNotes.length})</CardTitle>
          <CardDescription>Manage your product release communications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releaseNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      v{note.version}
                    </div>
                  </TableCell>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeColor(note.type) as any}>
                      {note.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryColor(note.category) as any}>
                      {note.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={note.isPublished ? 'default' : 'secondary'}>
                      {note.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingNote(note)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!note.isPublished && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(note.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Release Note Dialog */}
      {viewingNote && (
        <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <GitBranch className="h-5 w-5" />
                Version {viewingNote.version} - {viewingNote.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getTypeColor(viewingNote.type) as any}>
                  {viewingNote.type}
                </Badge>
                <Badge variant={getCategoryColor(viewingNote.category) as any}>
                  {viewingNote.category}
                </Badge>
                <Badge variant={viewingNote.isPublished ? 'default' : 'secondary'}>
                  {viewingNote.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{viewingNote.description}</p>
              
              <div>
                <h4 className="font-medium mb-3">What's New:</h4>
                <div className="space-y-2">
                  {viewingNote.changes?.map((change: any) => (
                    <div key={change.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                      <span className="text-lg">{getChangeTypeIcon(change.type)}</span>
                      <div>
                        <span className="font-medium capitalize text-sm">{change.type}: </span>
                        <span className="text-sm">{change.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-4 border-t">
                <p>Created: {new Date(viewingNote.createdAt).toLocaleString()}</p>
                {viewingNote.publishedAt && (
                  <p>Published: {new Date(viewingNote.publishedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};