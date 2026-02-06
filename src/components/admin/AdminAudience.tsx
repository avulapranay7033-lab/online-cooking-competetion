import { useState, useEffect } from 'react';
import { Users, Phone, Trash2, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAudiences, deleteAudience, getChefById } from '@/lib/storage';
import { Audience } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminAudience = () => {
  const { toast } = useToast();
  const [audiences, setAudiences] = useState<Audience[]>([]);

  useEffect(() => {
    setAudiences(getAudiences());
  }, []);

  const handleDeleteAudience = (audienceId: string, audienceName: string) => {
    deleteAudience(audienceId);
    setAudiences(prev => prev.filter(a => a.id !== audienceId));
    toast({
      title: 'Audience Removed',
      description: `${audienceName} has been removed`,
    });
  };

  const getVotedChefName = (votedChefId?: string): string => {
    if (!votedChefId) return 'Not voted yet';
    const chef = getChefById(votedChefId);
    return chef ? chef.name : 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Registered Audience</h2>
          <p className="text-muted-foreground">Manage all registered voters</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-secondary">
          <span className="font-bold">{audiences.length}</span>
          <span className="text-muted-foreground ml-1">Total</span>
        </div>
      </div>

      {/* Audience List */}
      {audiences.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="py-16 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">No Audience Registered</h3>
            <p className="text-muted-foreground">Audience members will appear here once they register</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {audiences.map((audience) => (
            <Card key={audience.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Audience?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {audience.name}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteAudience(audience.id, audience.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <h3 className="font-semibold text-lg mb-3">{audience.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{audience.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-primary" />
                    <span className={audience.votedChefId ? 'text-foreground' : 'text-muted-foreground'}>
                      {getVotedChefName(audience.votedChefId)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAudience;
