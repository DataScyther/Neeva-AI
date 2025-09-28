import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function DebugPanel() {
  return (
    <Card className="m-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Debug Panel
          <Badge variant="outline">Development Tools Removed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Test API functionality has been removed from the production build.
        </p>
      </CardContent>
    </Card>
  );
}
