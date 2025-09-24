import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  AlertTriangle, 
  Siren, 
  Shield, 
  Stethoscope, 
  Flame, 
  Car, 
  Droplets,
  Zap,
  Building2,
  Clock,
  MapPin
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  available24x7: boolean;
}

const Emergency: React.FC = () => {
  const [lastCalled, setLastCalled] = useState<string | null>(null);

  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'police',
      name: 'Police Emergency',
      number: '100',
      description: 'For crime, theft, violence, and law enforcement',
      icon: Shield,
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      available24x7: true
    },
    {
      id: 'fire',
      name: 'Fire Department',
      number: '101',
      description: 'For fire emergencies, rescue operations',
      icon: Flame,
      color: 'bg-red-500 hover:bg-red-600 text-white',
      available24x7: true
    },
    {
      id: 'ambulance',
      name: 'Medical Emergency',
      number: '108',
      description: 'For medical emergencies and ambulance services',
      icon: Stethoscope,
      color: 'bg-green-500 hover:bg-green-600 text-white',
      available24x7: true
    },
    {
      id: 'disaster',
      name: 'Disaster Management',
      number: '1078',
      description: 'For natural disasters, evacuation assistance',
      icon: AlertTriangle,
      color: 'bg-orange-500 hover:bg-orange-600 text-white',
      available24x7: true
    },
    {
      id: 'traffic',
      name: 'Traffic Police',
      number: '103',
      description: 'For traffic accidents, road blockages',
      icon: Car,
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      available24x7: false
    },
    {
      id: 'water',
      name: 'Water Emergency',
      number: '1916',
      description: 'For water supply issues, pipe bursts',
      icon: Droplets,
      color: 'bg-cyan-500 hover:bg-cyan-600 text-white',
      available24x7: false
    },
    {
      id: 'electricity',
      name: 'Power Outage',
      number: '1912',
      description: 'For electrical faults, power cuts',
      icon: Zap,
      color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      available24x7: true
    },
    {
      id: 'municipal',
      name: 'Municipal Corp',
      number: '1950',
      description: 'For civic issues, infrastructure problems',
      icon: Building2,
      color: 'bg-gray-500 hover:bg-gray-600 text-white',
      available24x7: false
    }
  ];

  const handleEmergencyCall = (contact: EmergencyContact) => {
    setLastCalled(contact.id);
    // In a real app, this would initiate a phone call
    window.open(`tel:${contact.number}`, '_self');
    
    // Clear the highlight after 3 seconds
    setTimeout(() => setLastCalled(null), 3000);
  };

  const EmergencyCard: React.FC<{ contact: EmergencyContact }> = ({ contact }) => {
    const Icon = contact.icon;
    const isRecentlyCalled = lastCalled === contact.id;
    
    return (
      <Card className={`transition-all duration-300 hover:scale-105 ${
        isRecentlyCalled ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-card'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${contact.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={contact.available24x7 ? 'default' : 'secondary'} className="text-xs">
                  {contact.available24x7 ? '24x7 Available' : 'Business Hours'}
                </Badge>
                {contact.available24x7 && (
                  <Clock className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4 text-sm leading-relaxed">
            {contact.description}
          </CardDescription>
          <Button 
            onClick={() => handleEmergencyCall(contact)}
            className={`w-full ${contact.color} shadow-lg`}
            size="lg"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call {contact.number}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Alert */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Siren className="h-8 w-8 text-destructive flex-shrink-0 animate-pulse" />
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Services</h1>
            <p className="text-muted-foreground mb-4">
              Quick access to emergency contact numbers. In case of life-threatening emergencies, 
              call immediately without delay.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">
                For immediate life-threatening emergencies, call 112 (National Emergency Number)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* National Emergency Number */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Siren className="h-6 w-6 text-destructive" />
                National Emergency Number
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Single number for all emergencies - Police, Fire, Medical
              </CardDescription>
            </div>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              24x7 Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.open('tel:112', '_self')}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
            size="lg"
          >
            <Phone className="mr-2 h-5 w-5" />
            Call 112 - Emergency
          </Button>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            Available in multiple languages • GPS location automatically shared
          </p>
        </CardContent>
      </Card>

      {/* Emergency Contacts Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Specialized Emergency Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {emergencyContacts.map((contact) => (
            <EmergencyCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Important Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">When Calling Emergency Services:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Stay calm and speak clearly</li>
                <li>• Provide your exact location</li>
                <li>• Describe the nature of emergency</li>
                <li>• Follow operator instructions</li>
                <li>• Keep your phone line open</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Location Information:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Share nearby landmarks</li>
                <li>• Mention cross streets or roads</li>
                <li>• Use GPS coordinates if available</li>
                <li>• Stay in a visible location if safe</li>
                <li>• Turn on location sharing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          Emergency numbers may vary by location. Verify local emergency numbers with your municipal corporation.
          This service is provided for convenience and may not be available 24x7 for all departments.
        </p>
      </div>
    </div>
  );
};

export default Emergency;