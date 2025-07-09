import React from 'react';
import { Palette, Snowflake, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'christmas':
        return <Snowflake className="h-4 w-4" />;
      case 'valentine':
        return <Heart className="h-4 w-4" />;
      case 'ramadan':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const currentTheme = availableThemes.find(t => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getThemeIcon(theme)}
          <span className="hidden sm:inline">{currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <p className="text-sm font-medium mb-2">Choose Theme</p>
          <div className="grid gap-2">
            {availableThemes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`cursor-pointer rounded-md p-3 ${
                  theme === themeOption.value ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getThemeIcon(themeOption.value)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{themeOption.label}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {themeOption.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};